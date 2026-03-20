import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TicTacToePage from './pages/TicTacToePage'
import FourInARowPage from './pages/FourInARowPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tictactoe" element={<TicTacToePage />} />
      <Route path="/four-in-a-row" element={<FourInARowPage />} />
    </Routes>
  )
}

export default App
