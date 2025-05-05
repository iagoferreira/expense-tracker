import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="bg-amber-900">
        <button onClick={() => setCount((count) => count + 1)}>
          up
        </button>
        <button className='bg-amber-600' onClick={() => setCount((count) => count - 1)}>
          down
        </button>
        <p>
          {count}
        </p>
      </div>
    </>
  )
}

export default App
