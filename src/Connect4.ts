
export const CONNECT4_ROWS = 6;
export const CONNECT4_COLS = 7;

export enum Connect4Chip {
    RED = 'r',
    YELLOW = 'y',
}

export interface Connect4Move {
    col: number;
}

export class Connect4Game {
    board: (Connect4Chip | null)[][];
    moves: Connect4Move[];
    nextChip: Connect4Chip = Connect4Chip.RED;
    winner: Connect4Chip | null = null;

    constructor() {
        this.moves = [];
        this.board = Array.from({ length: CONNECT4_ROWS }, () => Array(CONNECT4_COLS).fill(null));
    }

    public get isDraw(): boolean {
        return this.winner === null && this.moves.length === CONNECT4_ROWS * CONNECT4_COLS;
    }

    public get isOver(): boolean {
        return this.winner !== null || this.isDraw;
    }

    public addMove(move: Connect4Move) {
        const { col } = move;
        if (this.isOver) {
            throw new Error(`Game is already over`);
        }
        if (col < 0 || col >= CONNECT4_COLS) {
            throw new Error(`Column ${col} is out of bounds (0-${CONNECT4_COLS - 1})`);
        }

        // Find the lowest open row in the column
        let row = -1;
        for (let r = CONNECT4_ROWS - 1; r >= 0; r--) {
            if (this.board[r][col] === null) {
                row = r;
                break;
            }
        }
        if (row === -1) {
            throw new Error(`Column ${col} is full`);
        }

        this.board[row][col] = this.nextChip;
        this.moves.push(move);
        this.winner = this.checkWinner(row, col);
        this.nextChip = this.nextChip === Connect4Chip.RED ? Connect4Chip.YELLOW : Connect4Chip.RED;
    }

    public encode(): string {
        const parts: string[] = [
            ...this.moves.map(m => this.encodeMove(m))
        ];
        return parts.join('-');
    }

    public static decode(encoded: string): Connect4Game {
        const game = new Connect4Game();
        if (encoded === '') return game;

        const encodedParts = encoded.split('-');
        encodedParts.forEach(encodedMove => game.addMove(game.decodeMove(encodedMove)));

        return game;
    }

    private encodeMove({ col }: Connect4Move): string {
        return `${col}`;
    }

    private decodeMove(encoded: string): Connect4Move {
        const col = parseInt(encoded);
        if (isNaN(col) || col < 0 || col >= CONNECT4_COLS) {
            throw new Error(`Invalid encoded move: "${encoded}" is out of bounds (0-${CONNECT4_COLS - 1})`);
        }
        return { col };
    }

    private checkWinner(row: number, col: number): Connect4Chip | null {
        const chip = this.board[row][col];
        if (chip === null) return null;

        const directions = [
            { dr: 0, dc: 1 },   // horizontal
            { dr: 1, dc: 0 },   // vertical
            { dr: 1, dc: 1 },   // diagonal
            { dr: 1, dc: -1 },  // anti-diagonal
        ];

        for (const { dr, dc } of directions) {
            for (let offset = -3; offset <= 0; offset++) {
                const cells = [0, 1, 2, 3].map(i => {
                    const r = row + (offset + i) * dr;
                    const c = col + (offset + i) * dc;
                    if (r < 0 || r >= CONNECT4_ROWS || c < 0 || c >= CONNECT4_COLS) return null;
                    return this.board[r][c];
                });
                if (cells.every(cell => cell === chip)) return chip;
            }
        }

        return null;
    }
}
