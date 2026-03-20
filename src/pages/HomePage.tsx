import { Link } from 'react-router-dom'

const games = [
  { name: 'Tic Tac Toe', description: 'Classic 3-in-a-row game', path: '/tictactoe' },
  { name: '4 In A Row', description: 'Drop chips to connect four', path: '/four-in-a-row' },
]

function HomePage() {
  return (
    <main className="px-8 py-8 max-w-xl mx-auto">
      <h1>URL Encoded Games</h1>
      <p>Play turn-based games with a friend by passing a URL back and forth.</p>
      <div className="flex flex-col gap-4 mt-8">
        {games.map(game => (
          <Link
            key={game.path}
            to={game.path}
            className="block p-6 border border-white/20 hover:border-white/70 transition-colors duration-150 rounded-lg no-underline text-inherit"
          >
            <h2 className="mt-0 mb-2">{game.name}</h2>
            <p className="text-white/50">{game.description}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}

export default HomePage
