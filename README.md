# Chidhvi's Chess

A simple browser-based chess game built with **HTML, CSS, and JavaScript**.

## Features

- **Interactive chessboard**
  - 8×8 grid rendered with CSS Grid
  - Click pieces and destination squares to move
- **Piece movement rules**
  - Pawns (including initial 2-step moves and diagonal captures)
  - Rooks, bishops, queens (sliding moves)
  - Knights (L-shaped moves)
  - Kings (1 square in any direction)
- **Turn-based play**
  - White moves first, then Black, alternating turns
- **Check, checkmate, stalemate**
  - Moves that leave your own king in check are not allowed
  - Detects when the opposing king is in check
  - Detects checkmate (no legal moves while in check)
  - Detects stalemate (no legal moves but not in check)
- **Visuals**
  - Dark-themed board with light/dark squares
  - Unicode chess symbols for pieces (♔♕♖♗♘♙ and ♚♛♜♝♞♟)
  - High-contrast styling so white and black pieces are easy to see
  - Highlight for the selected piece and its legal target squares
- **Controls**
  - "New Game" button to reset the board
  - Turn indicator showing whose move it is (and if the side is in check)

## How to run (locally, no Docker)

1. Open the project folder:
   ```
   C:\Users\CHID\CascadeProjects\chidhvis-chess
   ```
2. Double-click `index.html` to open it in your web browser (Chrome, Edge, etc.).
3. Start playing:
   - Click your piece (White starts).
   - Legal destination squares are highlighted.
   - Click a highlighted square to make the move.

No build tools or servers are required. Everything runs directly in the browser.

## Running with Docker

### Build the image

From the project root:

```bash
docker build -t chidhvis-chess:latest .
```

### Run the container

```bash
docker run -d --name chidhvis-chess -p 8080:80 chidhvis-chess:latest
```

Then open:

```text
http://localhost:8080
```

To stop and remove the container:

```bash
docker stop chidhvis-chess
docker rm chidhvis-chess
```

### Using Docker Compose

You can also run the app using `docker-compose.yml` in this folder.

Start in detached mode:

```bash
docker compose up -d
```

Stop and clean up:

```bash
docker compose down
```

## File overview

- `index.html`
  - Main page that loads the board container, status bar, and scripts.
- `style.css`
  - Styles for the app shell, chessboard, squares, and piece appearance.
- `script.js`
  - Game logic: board state, move generation, check/checkmate detection, and UI interactions.
- `README.md`
  - This documentation file.

## Limitations / simplifications

- No advanced chess rules (yet):
  - No castling
  - No en passant
  - No pawn promotion UI
- No move history or undo button.

These can be added later if you want to expand the project.
