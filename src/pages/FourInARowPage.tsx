import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FourInARowGame, FourInARowChip } from '../games/FourInARow'
import FourInARowBoard from '../components/FourInARowBoard'
import Button from '../components/Button'

function loadGame(searchParams: URLSearchParams): FourInARowGame | null {
    const encoded = searchParams.get('game')
    if (encoded === null) return null
    try {
        return FourInARowGame.decode(encoded)
    } catch {
        return null
    }
}

function FourInARowPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [movedThisTurn, setMovedThisTurn] = useState(false)
    const [copied, setCopied] = useState(false)
    const [lastMove, setLastMove] = useState<{ row: number; col: number } | undefined>()

    const game = loadGame(searchParams)

    function startNewGame() {
        const newGame = new FourInARowGame()
        setSearchParams({ game: newGame.encode() })
        setMovedThisTurn(false)
        setCopied(false)
        setLastMove(undefined)
    }

    function handleColClick(col: number) {
        if (!game || game.isOver || movedThisTurn) return
        try {
            const newGame = FourInARowGame.decode(searchParams.get('game')!)
            newGame.addMove({ col })
            // Find the lowest filled cell in this column — that's where the chip landed
            let landedRow = 0
            for (let r = newGame.board.length - 1; r >= 0; r--) {
                if (newGame.board[r][col] !== null) { landedRow = r; break }
            }
            setSearchParams({ game: newGame.encode() })
            setLastMove({ row: landedRow, col })
            setMovedThisTurn(true)
            setCopied(false)
        } catch {
            // ignore invalid moves (e.g. full column)
        }
    }

    function handleCopyLink() {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true)
        })
    }

    function statusMessage(): string {
        if (!game) return ''
        if (game.winner === FourInARowChip.RED) return 'Red wins!'
        if (game.winner === FourInARowChip.YELLOW) return 'Yellow wins!'
        if (game.isDraw) return "It's a draw!"
        return game.nextChip === FourInARowChip.RED ? "Red's turn" : "Yellow's turn"
    }

    const showOverlay = game && (game.isOver || movedThisTurn)
    const showButtons = game && (game.isOver || movedThisTurn)

    return (
        <main className="px-8 py-8 max-w-lg mx-auto">
            <Link to="/">← Back</Link>
            <h1>4 In A Row</h1>

            {!game ? (
                <Button onClick={startNewGame}>Start New Game</Button>
            ) : (
                <>
                    <p className="text-xl font-bold">{statusMessage()}</p>
                    <FourInARowBoard
                        game={game}
                        onColClick={handleColClick}
                        overlay={showOverlay ? true : undefined}
                        lastMove={lastMove}
                    />
                    {showButtons && (
                        <div className="flex flex-col gap-3">
                            <Button onClick={handleCopyLink}>
                                {copied ? 'Copied!' : 'Copy & Share'}
                            </Button>
                            {game.isOver && (
                                <Button onClick={startNewGame}>New Game</Button>
                            )}
                        </div>
                    )}
                </>
            )}
        </main>
    )
}

export default FourInARowPage
