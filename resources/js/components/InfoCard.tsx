type InfoCardProps = {
  title: string
  value: string | number
  badge?: string
  badgeColor?: 'green' | 'yellow' | 'blue' | 'red'
}

export default function InfoCard({
  title,
  value,
  badge,
  badgeColor = 'blue',
}: InfoCardProps) {
  const badgeClasses: Record<string, string> = {
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    blue: 'bg-blue-100 text-blue-700',
    red: 'bg-red-100 text-red-700',
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm text-gray-500">{title}</p>

        {badge && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeClasses[badgeColor]}`}
          >
            {badge}
          </span>
        )}
      </div>

      <p className="text-2xl font-semibold text-gray-800">
        {value}
      </p>
    </div>
  )
}
