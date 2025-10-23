import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import LoginModal from './components/ui/Modal/LoginModal'

function App() {

  return (
    <>
    <Navbar />
    <main>
      <h1>Principal Zapetrol</h1>
    </main>
    <Footer />
    </>
  )
}

export default App
