/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import Editor from '@/components/Editor'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <main className='flex w-full h-screen'>
      <Editor/>
      </main> 
    </>
  )
}

export default App
