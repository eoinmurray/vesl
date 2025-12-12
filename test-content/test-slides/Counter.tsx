import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg">
      <p className="text-2xl font-bold">{count}</p>
      <div className="flex gap-2">
        <button
          onClick={() => setCount(c => c - 1)}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          -
        </button>
        <button
          onClick={() => setCount(c => c + 1)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          +
        </button>
      </div>
    </div>
  )
}
