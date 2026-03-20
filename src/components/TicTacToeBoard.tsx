import { ReactNode } from 'react'
import { TicTacToeGame, TicTacToeMark } from '../games/TicTacToe'

function CrossMark() {
    return (
        <svg viewBox="0 0 100 100" width="60%" height="60%">
            <line x1="20" y1="20" x2="80" y2="80" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
            <line x1="80" y1="20" x2="20" y2="80" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
        </svg>
    )
}

function CircleMark() {
    return (
        <svg viewBox="0 0 100 100" width="60%" height="60%">
            <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
        </svg>
    )
}

interface TicTacToeBoardProps {
    game: TicTacToeGame
    onCellClick: (row: number, col: number) => void
    overlay?: ReactNode
}

function TicTacToeBoard({ game, onCellClick, overlay }: TicTacToeBoardProps) {
    const CELL = 100
    const GAP = 6
    const SIZE = CELL * 3 + GAP * 2

    return (
        <div className="relative my-6" style={{ width: SIZE }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(3, ${CELL}px)`,
                gridTemplateRows: `repeat(3, ${CELL}px)`,
                gap: GAP,
            }}>
                {game.board.map((row, r) =>
                    row.map((cell, c) => {
                        const clickable = cell === null && !game.isOver && !overlay
                        return (
                            <button
                                key={`${r}-${c}`}
                                onClick={() => clickable && onCellClick(r, c)}
                                className={`flex items-center justify-center bg-transparent border border-white/20 rounded-lg p-0 text-inherit ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
                            >
                                {cell === TicTacToeMark.CROSS && <CrossMark />}
                                {cell === TicTacToeMark.CIRCLE && <CircleMark />}
                            </button>
                        )
                    })
                )}
            </div>

            {overlay && (
                <div className="absolute inset-0 bg-black/55 rounded-lg flex items-center justify-center">
                    {overlay}
                </div>
            )}
        </div>
    )
}

export default TicTacToeBoard
