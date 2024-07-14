import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <p className='text-2xl mx-auto mt-[45vh]'>This is a game</p>
  )
}

export default App
