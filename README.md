# URL Encoded Games

Play turn-based games with a friend by passing a URL back and forth — no accounts, no servers, no real-time connection required.

## How it works

The entire game state is encoded directly in the URL as a move history. When you make a move, the URL updates. You copy that URL and send it to your opponent. They open it, see the board replayed from the move history, make their move, and send the new URL back to you.

There is no backend. All game logic runs in the browser and the URL is the only persistence mechanism.

### URL format

**Tic Tac Toe:** `?game=<rows>-<cols>-<move1>-<move2>-...`

Each move is a cell index (`row * cols + col`), e.g. `3-3-4-0-8` is a 3x3 game with moves at the center, top-left, and bottom-right.

**4 In A Row:** `?game=<col1>-<col2>-...`

Each move is just a column index. The row is derived by replaying gravity (chips fall to the lowest open row). An empty game encodes to an empty string.

## Games

- **Tic Tac Toe** — Classic 3-in-a-row on a 3x3 board. X goes first.
- **4 In A Row** — Drop chips into a 6x7 board. Get 4 in a row horizontally, vertically, or diagonally to win. Red goes first.

## Development

```bash
npm install
npm run dev      # start dev server
npm test         # run unit tests
npm run deploy   # build and deploy to GitHub Pages
```

## Tech

- [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev) for bundling
- [Tailwind CSS](https://tailwindcss.com) for styling
- [React Router](https://reactrouter.com) for client-side routing
- [Vitest](https://vitest.dev) for unit tests
- [gh-pages](https://github.com/tschaub/gh-pages) for deployment
