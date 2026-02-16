interface SkillTagProps {
  skill: string
  size?: 'sm' | 'md'
}

export default function SkillTag({ skill, size = 'sm' }: SkillTagProps) {
  const sizeStyles = size === 'sm'
    ? 'px-2 py-0.5 text-xs'
    : 'px-3 py-1 text-sm'

  return (
    <span
      className={`inline-block bg-blue-50 text-blue-700 rounded-full font-medium ${sizeStyles}`}
    >
      {skill}
    </span>
  )
}
