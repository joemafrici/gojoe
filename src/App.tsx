import { Route, Routes } from 'react-router-dom'
import Navbar from './Navbar'
import Home from './Home'
import Projects from './Projects'
import './App.css'
import './assets/fonts/HackNerdFont-Regular.ttf'

function App() {

  return (
    <>
      <Navbar />
      <h1>Joe Mafrici test workflow change 5</h1>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Projects' element={<Projects />} />
      </Routes>
    </>
  )
}

export default App
