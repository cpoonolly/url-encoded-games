import { Link } from 'react-router-dom'

function TicTacToePage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <Link to="/">← Back</Link>
      <h1>Tic Tac Toe</h1>
      <p>Coming soon.</p>
    </main>
  )
}

export default TicTacToePage
