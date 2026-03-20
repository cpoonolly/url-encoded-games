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

function getLastMove(game: FourInARowGame): { row: number; col: number } | undefined {
    if (game.moves.length === 0) return undefined
    const col = game.moves[game.moves.length - 1].col
    // Find the topmost filled cell in the column (that's where the last chip is)
    for (let r = 0; r < game.board.length; r++) {
        if (game.board[r][col] !== null) return { row: r, col }
    }
    return undefined
}

function FourInARowPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [movedThisTurn, setMovedThisTurn] = useState(false)
    const [copied, setCopied] = useState(false)
    const [animationKey, setAnimationKey] = useState(0)

    const game = loadGame(searchParams)
    const lastMove = game ? getLastMove(game) : undefined

    function startNewGame() {
        const newGame = new FourInARowGame()
        setSearchParams({ game: newGame.encode() })
        setMovedThisTurn(false)
        setCopied(false)
    }

    function handleColClick(col: number) {
        if (!game || game.isOver || movedThisTurn) return
        try {
            const newGame = FourInARowGame.decode(searchParams.get('game')!)
            newGame.addMove({ col })
            setSearchParams({ game: newGame.encode() })
            setAnimationKey(k => k + 1)
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
                        key={animationKey}
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
