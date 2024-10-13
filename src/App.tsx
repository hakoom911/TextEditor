/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import TextEditor from './components/TextEditor'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <main className='flex  w-full h-screen items-center justify-center bg-black'>
      <TextEditor/>
      </main> 
    </>
  )
}

export default App
