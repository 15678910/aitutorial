import { Link } from 'react-router-dom'

interface CommunityNavProps {
  activeTab: string
}

const tabs = [
  { key: 'hub', label: '허브', path: '/community' },
  { key: 'projects', label: '프로젝트', path: '/community/projects' },
  { key: 'qa', label: 'Q&A', path: '/community/qa' },
  { key: 'wiki', label: '위키', path: '/community/wiki' },
  { key: 'enterprise', label: '기업연계', path: '/community/enterprise' },
  { key: 'research', label: '연구협업', path: '/community/research' },
  { key: 'profile', label: '프로필', path: '/community/profile' },
]

export default function CommunityNav({ activeTab }: CommunityNavProps) {
  return (
    <nav className="border-b border-gray-200">
      <div className="flex gap-0 -mb-px">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key
          return (
            <Link
              key={tab.key}
              to={tab.path}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
