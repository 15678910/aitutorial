import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import SkillTag from './SkillTag'
import { PROJECT_CATEGORY_LABELS, type Project } from '../../types/community'

const STATUS_CONFIG = {
  recruiting: { text: '모집 중', color: 'bg-green-100 text-green-700' },
  in_progress: { text: '진행 중', color: 'bg-blue-100 text-blue-700' },
  completed: { text: '완료', color: 'bg-gray-100 text-gray-700' },
  showcase: { text: '쇼케이스', color: 'bg-purple-100 text-purple-700' },
}

const CATEGORY_COLORS: Record<string, string> = {
  education: 'bg-blue-100 text-blue-700',
  healthcare: 'bg-rose-100 text-rose-700',
  environment: 'bg-emerald-100 text-emerald-700',
  language: 'bg-amber-100 text-amber-700',
  accessibility: 'bg-teal-100 text-teal-700',
  business: 'bg-violet-100 text-violet-700',
  research: 'bg-cyan-100 text-cyan-700',
  other: 'bg-gray-100 text-gray-700',
}

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const statusConfig = STATUS_CONFIG[project.status]
  const categoryColor = CATEGORY_COLORS[project.category] || CATEGORY_COLORS.other
  const categoryLabel = PROJECT_CATEGORY_LABELS[project.category]

  const visibleSkills = project.skills.slice(0, 3)
  const extraSkillCount = project.skills.length - 3

  return (
    <Link to={`/community/projects/${project.id}`} className="block">
      <Card hoverable className="p-5 h-full flex flex-col">
        {/* Top: Badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor}`}>
            {categoryLabel}
          </span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusConfig.color}`}>
            {statusConfig.text}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h3>

        {/* Description (line-clamp-2) */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">{project.description}</p>

        {/* Skills */}
        {project.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {visibleSkills.map((skill) => (
              <SkillTag key={skill} skill={skill} />
            ))}
            {extraSkillCount > 0 && (
              <span className="text-xs text-gray-400 font-medium px-2 py-1">
                +{extraSkillCount}
              </span>
            )}
          </div>
        )}

        {/* Bottom: Members + Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {/* Member Avatars (initials circles) */}
            <div className="flex -space-x-2">
              {project.members.slice(0, 3).map((member) => (
                <div
                  key={member.userId}
                  className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center"
                  title={member.userName}
                >
                  <span className="text-[10px] font-bold text-indigo-600">
                    {member.userName.charAt(0)}
                  </span>
                </div>
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {project.members.length}/{project.maxMembers} 명
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <span>❤️</span> {project.likes}
            </span>
            <span className="flex items-center gap-1">
              <span>💬</span> {project.comments.length}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
