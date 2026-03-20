import { Link } from 'react-router-dom'

const games = [
  { name: 'Tic Tac Toe', description: 'Classic 3-in-a-row game', path: '/tictactoe' },
  { name: '4 In A Row', description: 'Drop chips to connect four', path: '/four-in-a-row' },
]

function HomePage() {
  return (
    <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>URL Encoded Games</h1>
      <p>Play turn-based games with a friend by passing a URL back and forth.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        {games.map(game => (
          <Link
            key={game.path}
            to={game.path}
            style={{
              display: 'block',
              padding: '1.5rem',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <h2 style={{ margin: '0 0 0.5rem' }}>{game.name}</h2>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)' }}>{game.description}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}

export default HomePage
