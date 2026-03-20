import { describe, it, expect } from 'vitest';
import { Connect4Game, Connect4Chip, CONNECT4_ROWS, CONNECT4_COLS } from './Connect4';

describe('Connect4Game', () => {
    describe('constructor', () => {
        it('creates an empty board', () => {
            const game = new Connect4Game();
            expect(game.board.length).toBe(CONNECT4_ROWS);
            expect(game.board[0].length).toBe(CONNECT4_COLS);
            expect(game.board.every(row => row.every(cell => cell === null))).toBe(true);
        });

        it('starts with RED to move', () => {
            const game = new Connect4Game();
            expect(game.nextChip).toBe(Connect4Chip.RED);
        });
    });

    describe('addMove', () => {
        it('drops chip to the bottom of an empty column', () => {
            const game = new Connect4Game();
            game.addMove({ col: 3 });
            expect(game.board[CONNECT4_ROWS - 1][3]).toBe(Connect4Chip.RED);
        });

        it('stacks chips on top of each other', () => {
            const game = new Connect4Game();
            game.addMove({ col: 3 }); // RED - bottom
            game.addMove({ col: 3 }); // YELLOW - on top
            expect(game.board[CONNECT4_ROWS - 1][3]).toBe(Connect4Chip.RED);
            expect(game.board[CONNECT4_ROWS - 2][3]).toBe(Connect4Chip.YELLOW);
        });

        it('alternates RED then YELLOW', () => {
            const game = new Connect4Game();
            game.addMove({ col: 0 });
            game.addMove({ col: 1 });
            expect(game.board[CONNECT4_ROWS - 1][0]).toBe(Connect4Chip.RED);
            expect(game.board[CONNECT4_ROWS - 1][1]).toBe(Connect4Chip.YELLOW);
        });

        it('throws on out of bounds column', () => {
            const game = new Connect4Game();
            expect(() => game.addMove({ col: CONNECT4_COLS })).toThrow('out of bounds');
        });

        it('throws on negative column', () => {
            const game = new Connect4Game();
            expect(() => game.addMove({ col: -1 })).toThrow('out of bounds');
        });

        it('throws when column is full', () => {
            const game = new Connect4Game();
            // Fill col 0 with 6 chips (3 RED, 3 YELLOW) by having both players use col 0,
            // with YELLOW using col 1 on alternate turns to avoid 4-in-a-row vertically.
            // Sequence: R0 Y1 R0 Y1 R0 Y1 R0 Y1 R0 Y1 R0
            // RED in col 0 at rows: 5, 4, 3, 2, 1, 0 (but wins at row 2 after 4th RED... )
            // Instead interleave so no 4-in-a-row: R0 Y0 R0 Y0 R0 Y0
            game.addMove({ col: 0 }); // RED   row 5
            game.addMove({ col: 0 }); // YELLOW row 4
            game.addMove({ col: 0 }); // RED   row 3
            game.addMove({ col: 0 }); // YELLOW row 2
            game.addMove({ col: 0 }); // RED   row 1
            game.addMove({ col: 0 }); // YELLOW row 0 — col 0 now full
            expect(() => game.addMove({ col: 0 })).toThrow('full');
        });

        it('throws if game is already over', () => {
            const game = new Connect4Game();
            // RED wins col 0
            for (let i = 0; i < 4; i++) {
                game.addMove({ col: 0 }); // RED
                if (i < 3) game.addMove({ col: 1 }); // YELLOW
            }
            expect(() => game.addMove({ col: 2 })).toThrow('already over');
        });
    });

    describe('winner detection', () => {
        it('detects a vertical win', () => {
            const game = new Connect4Game();
            for (let i = 0; i < 4; i++) {
                game.addMove({ col: 0 }); // RED
                if (i < 3) game.addMove({ col: 1 }); // YELLOW
            }
            expect(game.winner).toBe(Connect4Chip.RED);
        });

        it('detects a horizontal win', () => {
            const game = new Connect4Game();
            // RED plays cols 0-3, YELLOW plays col 6 as filler
            for (let i = 0; i < 4; i++) {
                game.addMove({ col: i }); // RED
                if (i < 3) game.addMove({ col: 6 }); // YELLOW
            }
            expect(game.winner).toBe(Connect4Chip.RED);
        });

        it('detects a diagonal win (bottom-left to top-right)', () => {
            // Target: RED wins on (row5,col0), (row4,col1), (row3,col2), (row2,col3)
            // Setup: col1 needs 1 filler, col2 needs 2 fillers, col3 needs 3 fillers (all YELLOW)
            // RED filler uses col6 only (max 3 times — no vertical win)
            // YELLOW filler during RED's diagonal uses col5 only (max 3 times — no vertical win)
            // YELLOW setup chips: col1×1, col2×2, col3×3 — no 4-in-a-row possible there
            const game = new Connect4Game();
            game.addMove({ col: 6 }); // RED filler (row5)
            game.addMove({ col: 1 }); // YELLOW — col1 height=1
            game.addMove({ col: 6 }); // RED filler (row4)
            game.addMove({ col: 2 }); // YELLOW — col2 height=1
            game.addMove({ col: 6 }); // RED filler (row3)
            game.addMove({ col: 2 }); // YELLOW — col2 height=2
            // RED has 3 in col6 (rows 5,4,3) — safe, no 4th coming
            game.addMove({ col: 0 }); // RED row5
            game.addMove({ col: 3 }); // YELLOW — col3 height=1
            game.addMove({ col: 1 }); // RED row4
            game.addMove({ col: 3 }); // YELLOW — col3 height=2
            game.addMove({ col: 2 }); // RED row3
            game.addMove({ col: 3 }); // YELLOW — col3 height=3
            game.addMove({ col: 3 }); // RED row2 — wins diagonal (row5,col0)-(row4,col1)-(row3,col2)-(row2,col3)
            expect(game.winner).toBe(Connect4Chip.RED);
        });

        it('detects an anti-diagonal win (top-left to bottom-right)', () => {
            // Target: RED wins on (row5,col3), (row4,col2), (row3,col1), (row2,col0)
            // Setup: col2 needs 1 filler, col1 needs 2 fillers, col0 needs 3 fillers (all YELLOW)
            // RED filler uses col6 only (max 3 times)
            const game = new Connect4Game();
            game.addMove({ col: 6 }); // RED filler (row5)
            game.addMove({ col: 2 }); // YELLOW — col2 height=1
            game.addMove({ col: 6 }); // RED filler (row4)
            game.addMove({ col: 1 }); // YELLOW — col1 height=1
            game.addMove({ col: 6 }); // RED filler (row3)
            game.addMove({ col: 1 }); // YELLOW — col1 height=2
            // RED has 3 in col6 — safe
            game.addMove({ col: 3 }); // RED row5
            game.addMove({ col: 0 }); // YELLOW — col0 height=1
            game.addMove({ col: 2 }); // RED row4
            game.addMove({ col: 0 }); // YELLOW — col0 height=2
            game.addMove({ col: 1 }); // RED row3
            game.addMove({ col: 0 }); // YELLOW — col0 height=3
            game.addMove({ col: 0 }); // RED row2 — wins anti-diagonal (row5,col3)-(row4,col2)-(row3,col1)-(row2,col0)
            expect(game.winner).toBe(Connect4Chip.RED);
        });

        it('no winner mid-game', () => {
            const game = new Connect4Game();
            game.addMove({ col: 0 });
            game.addMove({ col: 1 });
            game.addMove({ col: 2 });
            expect(game.winner).toBeNull();
        });

        it('3 in a row is not a win', () => {
            const game = new Connect4Game();
            game.addMove({ col: 0 }); // RED
            game.addMove({ col: 6 }); // YELLOW
            game.addMove({ col: 1 }); // RED
            game.addMove({ col: 6 }); // YELLOW
            game.addMove({ col: 2 }); // RED - 3 in a row, not a win
            expect(game.winner).toBeNull();
        });
    });

    describe('isDraw / isOver', () => {
        it('isOver is true after a win', () => {
            const game = new Connect4Game();
            for (let i = 0; i < 4; i++) {
                game.addMove({ col: 0 }); // RED
                if (i < 3) game.addMove({ col: 1 }); // YELLOW
            }
            expect(game.isOver).toBe(true);
            expect(game.isDraw).toBe(false);
        });
    });

    describe('encode / decode', () => {
        it('encodes an empty game', () => {
            const game = new Connect4Game();
            expect(game.encode()).toBe('');
        });

        it('round-trips a game in progress', () => {
            const game = new Connect4Game();
            game.addMove({ col: 3 });
            game.addMove({ col: 4 });
            game.addMove({ col: 3 });

            const decoded = Connect4Game.decode(game.encode());
            expect(decoded.board).toEqual(game.board);
            expect(decoded.moves).toEqual(game.moves);
            expect(decoded.nextChip).toBe(game.nextChip);
        });

        it('round-trips a finished game', () => {
            const game = new Connect4Game();
            for (let i = 0; i < 4; i++) {
                game.addMove({ col: 0 }); // RED
                if (i < 3) game.addMove({ col: 1 }); // YELLOW
            }

            const decoded = Connect4Game.decode(game.encode());
            expect(decoded.winner).toBe(Connect4Chip.RED);
            expect(decoded.isOver).toBe(true);
        });

        it('throws on invalid column in encoded string', () => {
            expect(() => Connect4Game.decode('z')).toThrow('Invalid encoded move');
        });

        it('throws on out-of-bounds column in encoded string', () => {
            expect(() => Connect4Game.decode('99')).toThrow('out of bounds');
        });

        it('throws on full column in encoded string', () => {
            const game = new Connect4Game();
            // Alternate both players into col 0 to fill it without any 4-in-a-row
            for (let i = 0; i < CONNECT4_ROWS; i++) {
                game.addMove({ col: 0 });
            }
            const encoded = game.encode() + '-0';
            expect(() => Connect4Game.decode(encoded)).toThrow('full');
        });
    });
});
