import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import type { CommunityProfile, CommunityRole } from '../types/community'
import { COMMUNITY_ROLES } from '../types/community'

interface CommunityState {
  profiles: Map<string, CommunityProfile>
  loading: boolean
  getProfile: (userId: string) => CommunityProfile | null
  updateProfile: (userId: string, updates: Partial<CommunityProfile>) => void
  addReputation: (userId: string, points: number) => void
  initProfile: (userId: string, displayName: string) => void
}

const STORAGE_KEY = 'ai-platform-community-profiles'

// localStorage helpers
function loadFromStorage<T>(key: string, defaultVal: T): T {
  try {
    const data = localStorage.getItem(key)
    if (data) return JSON.parse(data)
  } catch { /* ignore */ }
  return defaultVal
}

function saveToStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch { /* quota exceeded, ignore */ }
}

function getRoleForReputation(reputation: number): CommunityRole {
  for (let i = COMMUNITY_ROLES.length - 1; i >= 0; i--) {
    if (reputation >= COMMUNITY_ROLES[i].min) return COMMUNITY_ROLES[i].role
  }
  return 'learner'
}

const getSampleProfiles = (): Map<string, CommunityProfile> => {
  const map = new Map<string, CommunityProfile>()
  map.set('sample-user-1', {
    userId: 'sample-user-1',
    displayName: '김민수',
    bio: 'AI 연구에 관심있는 학생입니다',
    skills: ['Python', 'ML', 'NLP'],
    reputation: 75,
    role: 'contributor',
    projectCount: 2,
    answerCount: 8,
    wikiContributions: 3,
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
  })
  return map
}

const loadInitialProfiles = (): Map<string, CommunityProfile> => {
  const stored = loadFromStorage<Record<string, CommunityProfile>>(STORAGE_KEY, {})
  if (Object.keys(stored).length > 0) {
    return new Map(Object.entries(stored))
  }
  return getSampleProfiles()
}

const saveProfilesToStorage = (profiles: Map<string, CommunityProfile>) => {
  const obj = Object.fromEntries(profiles.entries())
  saveToStorage(STORAGE_KEY, obj)
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
  profiles: loadInitialProfiles(),
  loading: false,

  getProfile: (userId: string) => {
    return get().profiles.get(userId) ?? null
  },

  updateProfile: (userId: string, updates: Partial<CommunityProfile>) => {
    set((state) => {
      const newProfiles = new Map(state.profiles)
      const existing = newProfiles.get(userId)
      if (!existing) return state
      newProfiles.set(userId, { ...existing, ...updates })
      saveProfilesToStorage(newProfiles)
      return { profiles: newProfiles }
    })

    // Try to sync with Supabase
    try {
      supabase
        .from('community_profiles')
        .update(updates)
        .eq('user_id', userId)
    } catch (error) {
      console.error('Failed to sync profile update to Supabase:', error)
    }
  },

  addReputation: (userId: string, points: number) => {
    set((state) => {
      const newProfiles = new Map(state.profiles)
      const existing = newProfiles.get(userId)
      if (!existing) return state
      const newReputation = existing.reputation + points
      const newRole = getRoleForReputation(newReputation)
      newProfiles.set(userId, { ...existing, reputation: newReputation, role: newRole })
      saveProfilesToStorage(newProfiles)
      return { profiles: newProfiles }
    })

    // Try to sync with Supabase
    try {
      const profile = get().profiles.get(userId)
      if (profile) {
        supabase
          .from('community_profiles')
          .update({ reputation: profile.reputation, role: profile.role })
          .eq('user_id', userId)
      }
    } catch (error) {
      console.error('Failed to sync reputation to Supabase:', error)
    }
  },

  initProfile: (userId: string, displayName: string) => {
    const existing = get().profiles.get(userId)
    if (existing) return

    const newProfile: CommunityProfile = {
      userId,
      displayName,
      bio: '',
      skills: [],
      reputation: 0,
      role: 'learner',
      projectCount: 0,
      answerCount: 0,
      wikiContributions: 0,
      joinedAt: new Date().toISOString(),
    }

    set((state) => {
      const newProfiles = new Map(state.profiles)
      newProfiles.set(userId, newProfile)
      saveProfilesToStorage(newProfiles)
      return { profiles: newProfiles }
    })

    // Try to sync with Supabase
    try {
      supabase.from('community_profiles').insert({
        user_id: userId,
        display_name: displayName,
        bio: '',
        skills: [],
        reputation: 0,
        role: 'learner',
        project_count: 0,
        answer_count: 0,
        wiki_contributions: 0,
        joined_at: newProfile.joinedAt,
      })
    } catch (error) {
      console.error('Failed to sync new profile to Supabase:', error)
    }
  },
}))
