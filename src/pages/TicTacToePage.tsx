import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { TicTacToeGame, TicTacToeMark } from '../games/TicTacToe'

function loadGame(searchParams: URLSearchParams): TicTacToeGame | null {
    const encoded = searchParams.get('game')
    if (!encoded) return null
    try {
        return TicTacToeGame.decode(encoded)
    } catch {
        return null
    }
}

function TicTacToePage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [copied, setCopied] = useState(false)

    const game = loadGame(searchParams)

    function startNewGame() {
        const newGame = new TicTacToeGame(3, 3)
        setSearchParams({ game: newGame.encode() })
    }

    function handleCellClick(row: number, col: number) {
        if (!game || game.isOver) return
        try {
            const newGame = TicTacToeGame.decode(searchParams.get('game')!)
            newGame.addMove({ row, col })
            setSearchParams({ game: newGame.encode() })
            setCopied(false)
        } catch {
            // ignore invalid moves
        }
    }

    function handleCopyLink() {
        const url = window.location.href
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    function statusMessage() {
        if (!game) return ''
        if (game.winner === TicTacToeMark.CROSS) return '✕ wins!'
        if (game.winner === TicTacToeMark.CIRCLE) return '○ wins!'
        if (game.isDraw) return "It's a draw!"
        return game.nextMark === TicTacToeMark.CROSS ? '✕\'s turn' : '○\'s turn'
    }

    return (
        <main style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
            <Link to="/">← Back</Link>
            <h1>Tic Tac Toe</h1>

            {!game ? (
                <button onClick={startNewGame}>Start New Game</button>
            ) : (
                <>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{statusMessage()}</p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 100px)',
                        gridTemplateRows: 'repeat(3, 100px)',
                        gap: '4px',
                        margin: '1rem 0',
                    }}>
                        {game.board.map((row, r) =>
                            row.map((cell, c) => (
                                <button
                                    key={`${r}-${c}`}
                                    onClick={() => handleCellClick(r, c)}
                                    disabled={cell !== null || game.isOver}
                                    style={{
                                        fontSize: '2.5rem',
                                        cursor: cell !== null || game.isOver ? 'default' : 'pointer',
                                        background: '#f5f5f5',
                                        border: '2px solid #ccc',
                                        borderRadius: '4px',
                                    }}
                                >
                                    {cell === TicTacToeMark.CROSS ? '✕' : cell === TicTacToeMark.CIRCLE ? '○' : ''}
                                </button>
                            ))
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <button onClick={handleCopyLink}>
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                        <button onClick={startNewGame}>New Game</button>
                    </div>
                </>
            )}
        </main>
    )
}

export default TicTacToePage
