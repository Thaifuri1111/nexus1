'use client'

interface StatusBadgeProps {
  status: 'pending' | 'completed' | 'rejected'
}

const statusColors = {
  pending: 'bg-warning/20 text-warning border-warning/50',
  completed: 'bg-success/20 text-success border-success/50',
  rejected: 'bg-danger/20 text-danger border-danger/50',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`px-3 py-1 rounded-full text-sm border ${statusColors[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}