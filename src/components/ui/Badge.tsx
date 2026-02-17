import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'default' | 'verified' | 'pending' | 'level1' | 'level2' | 'level3' | 'rejected' | 'new' | 'likeNew' | 'good' | 'fair'
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

export function Badge({ variant = 'default', children, className, icon }: BadgeProps) {
  const variants = {
    default: 'bg-muted text-muted-foreground',
    verified: 'bg-green-100 text-green-800 border border-green-300',
    pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    level1: 'bg-blue-100 text-blue-800 border border-blue-300',
    level2: 'bg-purple-100 text-purple-800 border border-purple-300',
    level3: 'bg-treigo-sage text-treigo-dark border border-treigo-olive',
    rejected: 'bg-red-100 text-red-800 border border-red-300',
    new: 'bg-emerald-100 text-emerald-800',
    likeNew: 'bg-teal-100 text-teal-800',
    good: 'bg-sky-100 text-sky-800',
    fair: 'bg-amber-100 text-amber-800',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full',
        variants[variant],
        className
      )}
    >
      {icon}
      {children}
    </span>
  )
}

// Specialized badge for trust verification
export function TrustBadge({ level }: { level: 'PENDING' | 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'REJECTED' }) {
  const config = {
    PENDING: { variant: 'pending' as const, label: 'Në pritje', icon: '⏳' },
    LEVEL_1: { variant: 'level1' as const, label: 'Nivel 1', icon: '✓' },
    LEVEL_2: { variant: 'level2' as const, label: 'Nivel 2', icon: '✓✓' },
    LEVEL_3: { variant: 'level3' as const, label: 'Trèigo Verified', icon: '✓✓✓' },
    REJECTED: { variant: 'rejected' as const, label: 'Refuzuar', icon: '✗' },
  }

  const { variant, label, icon } = config[level]

  return (
    <Badge variant={variant} icon={<span>{icon}</span>}>
      {label}
    </Badge>
  )
}

// Specialized badge for product condition
export function ConditionBadge({ condition }: { condition: 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' }) {
  const config = {
    NEW: { variant: 'new' as const, label: 'I ri' },
    LIKE_NEW: { variant: 'likeNew' as const, label: 'Si i ri' },
    GOOD: { variant: 'good' as const, label: 'I mirë' },
    FAIR: { variant: 'fair' as const, label: 'Mesatar' },
  }

  const { variant, label } = config[condition]

  return <Badge variant={variant}>{label}</Badge>
}
