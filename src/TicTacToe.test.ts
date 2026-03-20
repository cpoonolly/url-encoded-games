import { describe, it, expect } from 'vitest';
import { TicTacToeGame, TicTacToeMark } from './TicTacToe';

describe('TicTacToeGame', () => {
    describe('constructor', () => {
        it('creates an empty board', () => {
            const game = new TicTacToeGame();
            expect(game.board).toEqual([
                [null, null, null],
                [null, null, null],
                [null, null, null],
            ]);
        });

        it('starts with CROSS to move', () => {
            const game = new TicTacToeGame();
            expect(game.nextMark).toBe(TicTacToeMark.CROSS);
        });

        it('supports non-square boards', () => {
            const game = new TicTacToeGame(3, 5);
            expect(game.board.length).toBe(3);
            expect(game.board[0].length).toBe(5);
        });

        it('throws if rows < 3', () => {
            expect(() => new TicTacToeGame(2, 3)).toThrow('at least 3x3');
        });

        it('throws if cols < 3', () => {
            expect(() => new TicTacToeGame(3, 2)).toThrow('at least 3x3');
        });
    });

    describe('addMove', () => {
        it('places marks alternating CROSS then CIRCLE', () => {
            const game = new TicTacToeGame();
            game.addMove({ row: 0, col: 0 });
            game.addMove({ row: 1, col: 1 });
            expect(game.board[0][0]).toBe(TicTacToeMark.CROSS);
            expect(game.board[1][1]).toBe(TicTacToeMark.CIRCLE);
        });

        it('throws on occupied cell', () => {
            const game = new TicTacToeGame();
            game.addMove({ row: 0, col: 0 });
            expect(() => game.addMove({ row: 0, col: 0 })).toThrow('already occupied');
        });

        it('throws on out of bounds row', () => {
            const game = new TicTacToeGame();
            expect(() => game.addMove({ row: 3, col: 0 })).toThrow('out of bounds');
        });

        it('throws on out of bounds col', () => {
            const game = new TicTacToeGame();
            expect(() => game.addMove({ row: 0, col: 3 })).toThrow('out of bounds');
        });

        it('throws on negative indices', () => {
            const game = new TicTacToeGame();
            expect(() => game.addMove({ row: -1, col: 0 })).toThrow('out of bounds');
        });

        it('throws if game is already over', () => {
            const game = new TicTacToeGame();
            // X wins top row
            game.addMove({ row: 0, col: 0 });
            game.addMove({ row: 1, col: 0 });
            game.addMove({ row: 0, col: 1 });
            game.addMove({ row: 1, col: 1 });
            game.addMove({ row: 0, col: 2 });
            expect(() => game.addMove({ row: 2, col: 0 })).toThrow('already over');
        });
    });

    describe('winner detection', () => {
        it('detects a row win', () => {
            const game = new TicTacToeGame();
            game.addMove({ row: 0, col: 0 }); // X
            game.addMove({ row: 1, col: 0 }); // O
            game.addMove({ row: 0, col: 1 }); // X
            game.addMove({ row: 1, col: 1 }); // O
            game.addMove({ row: 0, col: 2 }); // X wins row 0
            expect(game.winner).toBe(TicTacToeMark.CROSS);
        });

        it('detects a col win', () => {
            const game = new TicTacToeGame();
            game.addMove({ row: 0, col: 0 }); // X
            game.addMove({ row: 0, col: 1 }); // O
            game.addMove({ row: 1, col: 0 }); // X
            game.addMove({ row: 1, col: 1 }); // O
            game.addMove({ row: 2, col: 0 }); // X wins col 0
            expect(game.winner).toBe(TicTacToeMark.CROSS);
        });

        it('detects a main diagonal win', () => {
            const game = new TicTacToeGame();
            game.addMove({ row: 0, col: 0 }); // X
            game.addMove({ row: 0, col: 1 }); // O
            game.addMove({ row: 1, col: 1 }); // X
            game.addMove({ row: 0, col: 2 }); // O
            game.addMove({ row: 2, col: 2 }); // X wins diagonal
            expect(game.winner).toBe(TicTacToeMark.CROSS);
        });

        it('detects an anti-diagonal win', () => {
            const game = new TicTacToeGame();
            game.addMove({ row: 0, col: 2 }); // X
            game.addMove({ row: 0, col: 0 }); // O
            game.addMove({ row: 1, col: 1 }); // X
            game.addMove({ row: 1, col: 0 }); // O
            game.addMove({ row: 2, col: 0 }); // X wins anti-diagonal
            expect(game.winner).toBe(TicTacToeMark.CROSS);
        });

        it('no winner mid-game', () => {
            const game = new TicTacToeGame();
            game.addMove({ row: 0, col: 0 });
            game.addMove({ row: 1, col: 1 });
            expect(game.winner).toBeNull();
        });

        it('detects a row win on a non-square board (3x5)', () => {
            const game = new TicTacToeGame(3, 5);
            game.addMove({ row: 0, col: 2 }); // X
            game.addMove({ row: 1, col: 0 }); // O
            game.addMove({ row: 0, col: 3 }); // X
            game.addMove({ row: 1, col: 1 }); // O
            game.addMove({ row: 0, col: 4 }); // X wins cols 2-4 of row 0
            expect(game.winner).toBe(TicTacToeMark.CROSS);
        });

        it('detects a diagonal win on a non-square board (3x5)', () => {
            const game = new TicTacToeGame(3, 5);
            game.addMove({ row: 0, col: 2 }); // X
            game.addMove({ row: 0, col: 0 }); // O
            game.addMove({ row: 1, col: 3 }); // X
            game.addMove({ row: 1, col: 0 }); // O
            game.addMove({ row: 2, col: 4 }); // X wins diagonal (0,2)-(1,3)-(2,4)
            expect(game.winner).toBe(TicTacToeMark.CROSS);
        });

        it('does not detect diagonal win on a 3x3 board that needs 4 in a row', () => {
            // sanity check: 2 in a row is not a win
            const game = new TicTacToeGame();
            game.addMove({ row: 0, col: 0 }); // X
            game.addMove({ row: 0, col: 2 }); // O
            game.addMove({ row: 1, col: 1 }); // X
            expect(game.winner).toBeNull();
        });
    });

    describe('isDraw / isOver', () => {
        it('detects a draw', () => {
            const game = new TicTacToeGame();
            // X O X
            // X X O
            // O X O  — draw
            game.addMove({ row: 0, col: 0 }); // X
            game.addMove({ row: 0, col: 1 }); // O
            game.addMove({ row: 0, col: 2 }); // X
            game.addMove({ row: 1, col: 2 }); // O
            game.addMove({ row: 1, col: 0 }); // X
            game.addMove({ row: 2, col: 0 }); // O
            game.addMove({ row: 1, col: 1 }); // X
            game.addMove({ row: 2, col: 2 }); // O
            game.addMove({ row: 2, col: 1 }); // X
            expect(game.isDraw).toBe(true);
            expect(game.winner).toBeNull();
            expect(game.isOver).toBe(true);
        });

        it('isOver is true after a win', () => {
            const game = new TicTacToeGame();
            game.addMove({ row: 0, col: 0 });
            game.addMove({ row: 1, col: 0 });
            game.addMove({ row: 0, col: 1 });
            game.addMove({ row: 1, col: 1 });
            game.addMove({ row: 0, col: 2 });
            expect(game.isOver).toBe(true);
            expect(game.isDraw).toBe(false);
        });
    });

    describe('encode / decode', () => {
        it('encodes an empty game', () => {
            const game = new TicTacToeGame();
            expect(game.encode()).toBe('3-3');
        });

        it('round-trips a game in progress', () => {
            const game = new TicTacToeGame();
            game.addMove({ row: 0, col: 0 });
            game.addMove({ row: 1, col: 1 });
            game.addMove({ row: 2, col: 2 });

            const decoded = TicTacToeGame.decode(game.encode());
            expect(decoded.board).toEqual(game.board);
            expect(decoded.moves).toEqual(game.moves);
            expect(decoded.nextMark).toBe(game.nextMark);
        });

        it('round-trips a finished game', () => {
            const game = new TicTacToeGame();
            game.addMove({ row: 0, col: 0 });
            game.addMove({ row: 1, col: 0 });
            game.addMove({ row: 0, col: 1 });
            game.addMove({ row: 1, col: 1 });
            game.addMove({ row: 0, col: 2 });

            const decoded = TicTacToeGame.decode(game.encode());
            expect(decoded.winner).toBe(TicTacToeMark.CROSS);
            expect(decoded.isOver).toBe(true);
        });

        it('round-trips a non-square board', () => {
            const game = new TicTacToeGame(3, 5);
            game.addMove({ row: 0, col: 4 });
            const decoded = TicTacToeGame.decode(game.encode());
            expect(decoded.rowCount).toBe(3);
            expect(decoded.colCount).toBe(5);
            expect(decoded.board[0][4]).toBe(TicTacToeMark.CROSS);
        });

        it('throws on board smaller than 3x3 in encoded string', () => {
            expect(() => TicTacToeGame.decode('2-3')).toThrow('at least 3x3');
        });

        it('throws on too-short encoded string', () => {
            expect(() => TicTacToeGame.decode('3')).toThrow('Invalid encoded game');
        });

        it('throws on invalid board dimensions', () => {
            expect(() => TicTacToeGame.decode('a-b')).toThrow('Invalid board dimensions');
        });

        it('throws on invalid move in encoded string', () => {
            expect(() => TicTacToeGame.decode('3-3-z')).toThrow('Invalid encoded move');
        });

        it('throws on out-of-bounds move in encoded string', () => {
            expect(() => TicTacToeGame.decode('3-3-99')).toThrow('out of bounds');
        });
    });
});
