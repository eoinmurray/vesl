export default function Chart({ data = [30, 60, 45, 80, 55] }: { data?: number[] }) {
  const max = Math.max(...data)

  return (
    <div className="flex items-end gap-2 h-32 p-4 bg-muted rounded-lg">
      {data.map((value, i) => (
        <div
          key={i}
          className="flex-1 bg-primary rounded-t transition-all hover:bg-primary/80"
          style={{ height: `${(value / max) * 100}%` }}
          title={`Value: ${value}`}
        />
      ))}
    </div>
  )
}
