import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { TicTacToeGame, TicTacToeMark } from '../games/TicTacToe'
import TicTacToeBoard from '../components/TicTacToeBoard'
import Button from '../components/Button'

function loadGame(searchParams: URLSearchParams): TicTacToeGame | null {
    const encoded = searchParams.get('game')
    if (!encoded) return null
    try {
        return TicTacToeGame.decode(encoded)
    } catch {
        return null
    }
}

function statusMessage(game: TicTacToeGame): string {
    if (game.winner === TicTacToeMark.CROSS) return 'X wins!'
    if (game.winner === TicTacToeMark.CIRCLE) return 'O wins!'
    if (game.isDraw) return "It's a draw!"
    return game.nextMark === TicTacToeMark.CROSS ? "X's turn" : "O's turn"
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
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        })
    }

    return (
        <main style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
            <Link to="/">← Back</Link>
            <h1>Tic Tac Toe</h1>

            {!game ? (
                <Button onClick={startNewGame}>Start New Game</Button>
            ) : (
                <>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{statusMessage(game)}</p>

                    <TicTacToeBoard game={game} onCellClick={handleCellClick} />

                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <Button onClick={handleCopyLink}>{copied ? 'Copied!' : 'Copy Link'}</Button>
                        <Button onClick={startNewGame}>New Game</Button>
                    </div>
                </>
            )}
        </main>
    )
}

export default TicTacToePage
