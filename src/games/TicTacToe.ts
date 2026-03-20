
export enum TicTacToeMark {
    CROSS = 'x',
    CIRCLE = 'o'
}

export interface TicTacToeMove {
    row: number;
    col: number;
}

export class TicTacToeGame {
    rowCount: number;
    colCount: number;
    board: (TicTacToeMark | null)[][];
    moves: TicTacToeMove[];
    nextMark: TicTacToeMark = TicTacToeMark.CROSS;
    winner: TicTacToeMark | null = null;

    constructor(rows = 3, cols = 3) {
        if (rows < 3 || cols < 3) {
            throw new Error(`Board must be at least 3x3, got ${rows}x${cols}`);
        }
        this.rowCount = rows;
        this.colCount = cols;
        this.moves = [];
        this.board = Array.from({ length: rows }, () => Array(cols).fill(null));
    }

    public get isDraw(): boolean {
        return this.winner === null && this.moves.length === this.rowCount * this.colCount;
    }

    public get isOver(): boolean {
        return this.winner !== null || this.isDraw;
    }

    public addMove(move: TicTacToeMove) {
        const {row, col} = move;
        if (this.isOver) {
            throw new Error(`Game is already over`);
        }
        if (row < 0 || row >= this.rowCount || col < 0 || col >= this.colCount) {
            throw new Error(`Move (${row}, ${col}) is out of bounds for a ${this.rowCount}x${this.colCount} board`);
        }
        if (this.board[row][col] !== null) {
            throw new Error(`Cell (${row}, ${col}) is already occupied`);
        }

        this.board[row][col] = this.nextMark;
        this.moves.push(move);
        this.winner = this.checkWinner(row, col);
        this.nextMark = this.nextMark === TicTacToeMark.CIRCLE ?
            TicTacToeMark.CROSS : TicTacToeMark.CIRCLE;
    }

    public encode(): string {
        const parts: string[] = [`${this.rowCount}`, `${this.colCount}`, ...this.moves.map(m => this.encodeMove(m))];
        return parts.join('-');
    }

    public static decode(encoded:string): TicTacToeGame {
        const encodedParts = encoded.split('-')
        if (encodedParts.length < 2) {
            throw new Error(`Invalid encoded game: expected at least "rows-cols", got "${encoded}"`);
        }

        const rowCount = parseInt(encodedParts[0]);
        const colCount = parseInt(encodedParts[1]);
        if (isNaN(rowCount) || isNaN(colCount)) {
            throw new Error(`Invalid board dimensions: "${encodedParts[0]}" x "${encodedParts[1]}"`);
        }

        const game = new TicTacToeGame(rowCount, colCount);
        encodedParts.slice(2).forEach(encodedMove => game.addMove(game.decodeMove(encodedMove)));

        return game;
    }

    private encodeMove({row, col}: TicTacToeMove): string {
        return `${(row * this.colCount) + col}`;
    }

    private decodeMove(encoded: string): TicTacToeMove {
        const index = parseInt(encoded);
        if (isNaN(index) || index < 0 || index >= this.rowCount * this.colCount) {
            throw new Error(`Invalid encoded move: "${encoded}" is out of bounds for a ${this.rowCount}x${this.colCount} board`);
        }

        const row = Math.floor(index / this.colCount);
        const col = index % this.colCount;

        return {row, col};
    }

    private checkWinner(row: number, col: number): TicTacToeMark | null {
        const mark = this.board[row][col];
        if (mark === null) return null;

        const directions = [
            { dr: 0, dc: 1 },   // horizontal
            { dr: 1, dc: 0 },   // vertical
            { dr: 1, dc: 1 },   // diagonal
            { dr: 1, dc: -1 },  // anti-diagonal
        ];

        for (const { dr, dc } of directions) {
            // Check all windows of 3 that include (row, col) in this direction
            for (let offset = -2; offset <= 0; offset++) {
                const cells = [0, 1, 2].map(i => {
                    const r = row + (offset + i) * dr;
                    const c = col + (offset + i) * dc;
                    if (r < 0 || r >= this.rowCount || c < 0 || c >= this.colCount) return null;
                    return this.board[r][c];
                });
                if (cells.every(cell => cell === mark)) return mark;
            }
        }

        return null;
    }
}