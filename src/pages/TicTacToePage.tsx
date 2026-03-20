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

function TicTacToePage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [movedThisTurn, setMovedThisTurn] = useState(false)
    const [copied, setCopied] = useState(false)

    const game = loadGame(searchParams)

    function startNewGame() {
        const newGame = new TicTacToeGame(3, 3)
        setSearchParams({ game: newGame.encode() })
        setMovedThisTurn(false)
        setCopied(false)
    }

    function handleCellClick(row: number, col: number) {
        if (!game || game.isOver || movedThisTurn) return
        try {
            const newGame = TicTacToeGame.decode(searchParams.get('game')!)
            newGame.addMove({ row, col })
            setSearchParams({ game: newGame.encode() })
            setMovedThisTurn(true)
            setCopied(false)
        } catch {
            // ignore invalid moves
        }
    }

    function handleCopyLink() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true)
        })
    }

    function statusMessage(): string {
        if (!game) return ''
        if (game.winner === TicTacToeMark.CROSS) return 'X wins!'
        if (game.winner === TicTacToeMark.CIRCLE) return 'O wins!'
        if (game.isDraw) return "It's a draw!"
        return game.nextMark === TicTacToeMark.CROSS ? "X's turn" : "O's turn"
    }

    function overlay() {
        if (!game) return undefined

        if (game.isOver) {
            return (
                <div className="text-center p-4">
                    <p className="text-2xl font-bold mb-4">{statusMessage()}</p>
                    <Button onClick={startNewGame}>New Game</Button>
                </div>
            )
        }

        if (movedThisTurn) {
            return (
                <Button onClick={handleCopyLink} className="bg-[var(--bg)]">
                    {copied ? 'Copied!' : 'Copy & Share'}
                </Button>
            )
        }

        return undefined
    }

    return (
        <main className="px-8 py-8 max-w-sm mx-auto">
            <Link to="/">← Back</Link>
            <h1>Tic Tac Toe</h1>

            {!game ? (
                <Button onClick={startNewGame}>Start New Game</Button>
            ) : (
                <>
                    <p className="text-xl font-bold">{statusMessage()}</p>
                    <TicTacToeBoard game={game} onCellClick={handleCellClick} overlay={overlay()} />
                </>
            )}
        </main>
    )
}

export default TicTacToePage
