import { FourInARowGame, FourInARowChip, FOUR_IN_A_ROW_ROWS, FOUR_IN_A_ROW_COLS } from '../games/FourInARow'

interface LastMove {
    row: number
    col: number
}

interface FourInARowBoardProps {
    game: FourInARowGame
    onColClick: (col: number) => void
    overlay?: boolean
    lastMove?: LastMove
}

function FourInARowBoard({ game, onColClick, overlay, lastMove }: FourInARowBoardProps) {
    const CELL = 56
    const GAP = 5
    const WIDTH = CELL * FOUR_IN_A_ROW_COLS + GAP * (FOUR_IN_A_ROW_COLS - 1)
    const HEIGHT = CELL * FOUR_IN_A_ROW_ROWS + GAP * (FOUR_IN_A_ROW_ROWS - 1)

    return (
        <div className="relative my-6 overflow-hidden" style={{ width: WIDTH }}>
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
                    row.map((cell, c) => {
                        const isLastMove = lastMove && lastMove.row === r && lastMove.col === c
                        const fallDistance = lastMove ? lastMove.row * (CELL + GAP) : 0
                        return (
                            <div
                                key={`${r}-${c}`}
                                className="rounded-full border border-white/20 flex items-center justify-center"
                            >
                                {cell === FourInARowChip.RED && (
                                    <div
                                        className="w-4/5 h-4/5 rounded-full bg-red-500"
                                        style={isLastMove ? {
                                            animation: `chipFall 0.35s cubic-bezier(0.33, 1, 0.68, 1) both`,
                                            ['--fall-distance' as string]: `-${fallDistance}px`,
                                        } : undefined}
                                    />
                                )}
                                {cell === FourInARowChip.YELLOW && (
                                    <div
                                        className="w-4/5 h-4/5 rounded-full bg-yellow-400"
                                        style={isLastMove ? {
                                            animation: `chipFall 0.35s cubic-bezier(0.33, 1, 0.68, 1) both`,
                                            ['--fall-distance' as string]: `-${fallDistance}px`,
                                        } : undefined}
                                    />
                                )}
                            </div>
                        )
                    })
                )}
            </div>

            {overlay && (
                <div className="absolute inset-0 bg-black/75 rounded-lg" />
            )}
        </div>
    )
}

export default FourInARowBoard
