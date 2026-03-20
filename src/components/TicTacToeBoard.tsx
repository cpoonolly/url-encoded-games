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
}

function TicTacToeBoard({ game, onCellClick }: TicTacToeBoardProps) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 100px)',
            gridTemplateRows: 'repeat(3, 100px)',
            gap: '6px',
            margin: '1.5rem 0',
        }}>
            {game.board.map((row, r) =>
                row.map((cell, c) => {
                    const clickable = cell === null && !game.isOver
                    return (
                        <button
                            key={`${r}-${c}`}
                            onClick={() => clickable && onCellClick(r, c)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'transparent',
                                border: '1px solid rgba(255,255,255,0.2)',
                                borderRadius: '8px',
                                cursor: clickable ? 'pointer' : 'default',
                                color: 'inherit',
                                padding: 0,
                            }}
                        >
                            {cell === TicTacToeMark.CROSS && <CrossMark />}
                            {cell === TicTacToeMark.CIRCLE && <CircleMark />}
                        </button>
                    )
                })
            )}
        </div>
    )
}

export default TicTacToeBoard
