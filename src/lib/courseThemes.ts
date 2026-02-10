export interface CourseTheme {
  slug: string
  bg: string           // main background color class
  bgLight: string      // lighter background
  bgGradient: string   // gradient background for hero areas
  text: string         // text color on colored bg
  accent: string       // accent/highlight color
  border: string       // border color
  cardBg: string       // card background
  iconBg: string       // icon background
  hex: string          // raw hex for SVG use
  hexLight: string     // lighter hex
}

export const courseThemes: Record<string, CourseTheme> = {
  'ai-intro': {
    slug: 'ai-intro',
    bg: 'bg-[#FF6B6B]',
    bgLight: 'bg-[#FFF0F0]',
    bgGradient: 'bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E]',
    text: 'text-white',
    accent: 'text-[#FF6B6B]',
    border: 'border-[#FF6B6B]/20',
    cardBg: 'bg-white',
    iconBg: 'bg-[#FF6B6B]/10',
    hex: '#FF6B6B',
    hexLight: '#FFF0F0',
  },
  'ml-basics': {
    slug: 'ml-basics',
    bg: 'bg-[#2EC4B6]',
    bgLight: 'bg-[#E8FAF7]',
    bgGradient: 'bg-gradient-to-br from-[#2EC4B6] to-[#3DD8C9]',
    text: 'text-white',
    accent: 'text-[#2EC4B6]',
    border: 'border-[#2EC4B6]/20',
    cardBg: 'bg-white',
    iconBg: 'bg-[#2EC4B6]/10',
    hex: '#2EC4B6',
    hexLight: '#E8FAF7',
  },
  'deep-learning': {
    slug: 'deep-learning',
    bg: 'bg-[#FFB830]',
    bgLight: 'bg-[#FFF8E8]',
    bgGradient: 'bg-gradient-to-br from-[#FFB830] to-[#FFC94D]',
    text: 'text-[#29264c]',
    accent: 'text-[#E5A028]',
    border: 'border-[#FFB830]/20',
    cardBg: 'bg-white',
    iconBg: 'bg-[#FFB830]/10',
    hex: '#FFB830',
    hexLight: '#FFF8E8',
  },
  'generative-ai': {
    slug: 'generative-ai',
    bg: 'bg-[#7C5CFC]',
    bgLight: 'bg-[#F0EDFF]',
    bgGradient: 'bg-gradient-to-br from-[#7C5CFC] to-[#9B82FD]',
    text: 'text-white',
    accent: 'text-[#7C5CFC]',
    border: 'border-[#7C5CFC]/20',
    cardBg: 'bg-white',
    iconBg: 'bg-[#7C5CFC]/10',
    hex: '#7C5CFC',
    hexLight: '#F0EDFF',
  },
  'building-ai': {
    slug: 'building-ai',
    bg: 'bg-[#E8A838]',
    bgLight: 'bg-[#FFF6E0]',
    bgGradient: 'bg-gradient-to-br from-[#E8A838] to-[#F0C060]',
    text: 'text-[#29264c]',
    accent: 'text-[#D09520]',
    border: 'border-[#E8A838]/20',
    cardBg: 'bg-white',
    iconBg: 'bg-[#E8A838]/10',
    hex: '#E8A838',
    hexLight: '#FFF6E0',
  },
}

export function getCourseTheme(slug: string): CourseTheme {
  return courseThemes[slug] || courseThemes['ai-intro']
}

// Chapter illustration colors per course
export const chapterColors: Record<string, string[]> = {
  'ai-intro': ['#FF6B6B', '#FF8E53', '#FFA07A'],
  'ml-basics': ['#2EC4B6', '#48D1CC', '#5FE0D0'],
  'deep-learning': ['#FFB830', '#FFC94D', '#FFD966'],
  'generative-ai': ['#7C5CFC', '#9B82FD', '#B8A3FE'],
  'building-ai': ['#E8A838', '#D09520', '#F0C060', '#C48A18', '#FFD566'],
}
