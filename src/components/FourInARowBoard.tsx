import { FourInARowGame, FourInARowChip, FOUR_IN_A_ROW_ROWS, FOUR_IN_A_ROW_COLS } from '../games/FourInARow'

interface FourInARowBoardProps {
    game: FourInARowGame
    onColClick: (col: number) => void
    overlay?: boolean
}

function FourInARowBoard({ game, onColClick, overlay }: FourInARowBoardProps) {
    const CELL = 56
    const GAP = 5
    const WIDTH = CELL * FOUR_IN_A_ROW_COLS + GAP * (FOUR_IN_A_ROW_COLS - 1)
    const HEIGHT = CELL * FOUR_IN_A_ROW_ROWS + GAP * (FOUR_IN_A_ROW_ROWS - 1)

    return (
        <div className="relative my-6" style={{ width: WIDTH }}>
            {/* Column click targets */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${FOUR_IN_A_ROW_COLS}, ${CELL}px)`,
                gap: GAP,
                position: 'absolute',
                inset: 0,
                zIndex: 1,
            }}>
                {Array.from({ length: FOUR_IN_A_ROW_COLS }, (_, c) => {
                    const colFull = game.board[0][c] !== null
                    const clickable = !game.isOver && !overlay && !colFull
                    return (
                        <button
                            key={c}
                            onClick={() => clickable && onColClick(c)}
                            className={`h-full bg-transparent border-none p-0 ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
                        />
                    )
                })}
            </div>

            {/* Board grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${FOUR_IN_A_ROW_COLS}, ${CELL}px)`,
                gridTemplateRows: `repeat(${FOUR_IN_A_ROW_ROWS}, ${CELL}px)`,
                gap: GAP,
                height: HEIGHT,
            }}>
                {game.board.map((row, r) =>
                    row.map((cell, c) => (
                        <div
                            key={`${r}-${c}`}
                            className="rounded-full border border-white/20 flex items-center justify-center"
                        >
                            {cell === FourInARowChip.RED && (
                                <div className="w-4/5 h-4/5 rounded-full bg-red-500" />
                            )}
                            {cell === FourInARowChip.YELLOW && (
                                <div className="w-4/5 h-4/5 rounded-full bg-yellow-400" />
                            )}
                        </div>
                    ))
                )}
            </div>

            {overlay && (
                <div className="absolute inset-0 bg-black/75 rounded-lg" />
            )}
        </div>
    )
}

export default FourInARowBoard
