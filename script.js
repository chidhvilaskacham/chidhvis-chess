// Basic chess implementation for "Chidhvi's Chess"
// - Renders an 8x8 board with Unicode chess pieces
// - Enforces turn order (White then Black)
// - Allows normal moves and simple captures
// - Does NOT implement check/checkmate, castling, en-passant, or promotion

const boardElement = document.getElementById('chessboard');
const turnIndicator = document.getElementById('turn-indicator');
const resetButton = document.getElementById('reset-btn');

// Board is stored as 8x8 array, [row][col], row 0 is Black's back rank
// Pieces are strings like 'wP' (white pawn), 'bK' (black king), or null
let board = [];
let selected = null; // {row, col}
let currentTurn = 'w'; // 'w' or 'b'
let gameOver = false;

const PIECE_EMOJI = {
  wK: '♔',
  wQ: '♕',
  wR: '♖',
  wB: '♗',
  wN: '♘',
  wP: '♙',
  bK: '♚',
  bQ: '♛',
  bR: '♜',
  bB: '♝',
  bN: '♞',
  bP: '♟︎',
};

function newGame() {
  board = [
    ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
    ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
    ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
  ];
  currentTurn = 'w';
  selected = null;
  gameOver = false;
  updateTurnIndicator();
  renderBoard();
}

function updateTurnIndicator() {
  turnIndicator.textContent = `Turn: ${currentTurn === 'w' ? 'White' : 'Black'}`;
}

function renderBoard() {
  boardElement.innerHTML = '';

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement('div');
      square.classList.add('square');

      const isDark = (row + col) % 2 === 1;
      square.classList.add(isDark ? 'dark' : 'light');

      const piece = board[row][col];
      if (piece) {
        const [color, type] = piece.split('');
        square.textContent = PIECE_EMOJI[piece];
        square.classList.add(color === 'w' ? 'white-piece' : 'black-piece');
      }

      square.dataset.row = row.toString();
      square.dataset.col = col.toString();

      square.addEventListener('click', onSquareClick);

      boardElement.appendChild(square);
    }
  }
}

function onSquareClick(e) {
  if (gameOver) return;
  const row = parseInt(e.currentTarget.dataset.row, 10);
  const col = parseInt(e.currentTarget.dataset.col, 10);
  const piece = board[row][col];

  if (!selected) {
    if (!piece) return;
    if (piece[0] !== currentTurn) return;

    selected = { row, col };
    renderBoard();
    highlightSelectedAndMoves();
  } else {
    const { row: sRow, col: sCol } = selected;

    if (sRow === row && sCol === col) {
      selected = null;
      renderBoard();
      return;
    }

    const moves = generateLegalMovesFilteringCheck(sRow, sCol);
    const isLegal = moves.some(m => m.row === row && m.col === col);

    if (!isLegal) {
      const pieceThere = board[row][col];
      if (pieceThere && pieceThere[0] === currentTurn) {
        selected = { row, col };
        renderBoard();
        highlightSelectedAndMoves();
      }
      return;
    }

    board[row][col] = board[sRow][sCol];
    board[sRow][sCol] = null;

    selected = null;
    currentTurn = currentTurn === 'w' ? 'b' : 'w';
    handlePostMoveState();
    renderBoard();
  }
}

function highlightSelectedAndMoves() {
  if (!selected) return;
  const moves = generateLegalMovesFilteringCheck(selected.row, selected.col);

  const squares = boardElement.querySelectorAll('.square');
  squares.forEach(sq => {
    const r = parseInt(sq.dataset.row, 10);
    const c = parseInt(sq.dataset.col, 10);

    if (r === selected.row && c === selected.col) {
      sq.classList.add('selected');
    }

    if (moves.some(m => m.row === r && m.col === c)) {
      sq.classList.add('move-target');
    }
  });
}

// Generate moves for a piece then filter out those that leave own king in check
function generateLegalMovesFilteringCheck(row, col) {
  const pseudo = generateMovesForSquare(row, col);
  const piece = board[row][col];
  if (!piece) return [];
  const color = piece[0];

  const legal = [];
  for (const move of pseudo) {
    const captured = board[move.row][move.col];
    board[move.row][move.col] = board[row][col];
    board[row][col] = null;

    const kingInCheck = isKingInCheck(color);

    board[row][col] = board[move.row][move.col];
    board[move.row][move.col] = captured;

    if (!kingInCheck) {
      legal.push(move);
    }
  }
  return legal;
}

function generateMovesForSquare(row, col) {
  const piece = board[row][col];
  if (!piece) return [];
  const color = piece[0];
  const type = piece[1];

  switch (type) {
    case 'P':
      return generatePawnMoves(row, col, color);
    case 'R':
      return generateRookMoves(row, col, color);
    case 'N':
      return generateKnightMoves(row, col, color);
    case 'B':
      return generateBishopMoves(row, col, color);
    case 'Q':
      return generateQueenMoves(row, col, color);
    case 'K':
      return generateKingMoves(row, col, color);
    default:
      return [];
  }
}

function findKing(color) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === color + 'K') {
        return { row: r, col: c };
      }
    }
  }
  return null;
}

function isSquareAttacked(row, col, byColor) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece || piece[0] !== byColor) continue;
      const moves = generateMovesForSquare(r, c);
      if (moves.some(m => m.row === row && m.col === col)) {
        return true;
      }
    }
  }
  return false;
}

function isKingInCheck(color) {
  const kingPos = findKing(color);
  if (!kingPos) return false;
  const enemyColor = color === 'w' ? 'b' : 'w';
  return isSquareAttacked(kingPos.row, kingPos.col, enemyColor);
}

function anyLegalMove(color) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece || piece[0] !== color) continue;
      const legal = generateLegalMovesFilteringCheck(r, c);
      if (legal.length > 0) return true;
    }
  }
  return false;
}

function handlePostMoveState() {
  const justMovedColor = currentTurn === 'w' ? 'b' : 'w';
  const enemyColor = currentTurn;

  const enemyInCheck = isKingInCheck(enemyColor);
  const enemyHasMove = anyLegalMove(enemyColor);

  if (enemyInCheck && !enemyHasMove) {
    gameOver = true;
    turnIndicator.textContent = `Checkmate! ${justMovedColor === 'w' ? 'White' : 'Black'} wins.`;
  } else if (!enemyInCheck && !enemyHasMove) {
    gameOver = true;
    turnIndicator.textContent = 'Draw: stalemate.';
  } else if (enemyInCheck) {
    turnIndicator.textContent = `Turn: ${currentTurn === 'w' ? 'White' : 'Black'} (in check)`;
  } else {
    updateTurnIndicator();
  }
}

function isOnBoard(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function pushIfValid(moves, r, c, color, stopOnBlock = true) {
  if (!isOnBoard(r, c)) return false;
  const target = board[r][c];
  if (!target) {
    moves.push({ row: r, col: c });
    return true;
  }
  if (target[0] !== color) {
    moves.push({ row: r, col: c });
  }
  return false;
}

function generatePawnMoves(row, col, color) {
  const moves = [];
  const dir = color === 'w' ? -1 : 1;
  const startRow = color === 'w' ? 6 : 1;

  const fwdR = row + dir;
  if (isOnBoard(fwdR, col) && !board[fwdR][col]) {
    moves.push({ row: fwdR, col });
    const fwd2R = row + 2 * dir;
    if (row === startRow && !board[fwd2R][col]) {
      moves.push({ row: fwd2R, col });
    }
  }

  const capCols = [col - 1, col + 1];
  for (const c of capCols) {
    const r = row + dir;
    if (!isOnBoard(r, c)) continue;
    const target = board[r][c];
    if (target && target[0] !== color) {
      moves.push({ row: r, col: c });
    }
  }

  return moves;
}

function generateSlidingMoves(row, col, color, directions) {
  const moves = [];
  for (const [dr, dc] of directions) {
    let r = row + dr;
    let c = col + dc;
    while (isOnBoard(r, c)) {
      const target = board[r][c];
      if (!target) {
        moves.push({ row: r, col: c });
      } else {
        if (target[0] !== color) {
          moves.push({ row: r, col: c });
        }
        break;
      }
      r += dr;
      c += dc;
    }
  }
  return moves;
}

function generateRookMoves(row, col, color) {
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  return generateSlidingMoves(row, col, color, directions);
}

function generateBishopMoves(row, col, color) {
  const directions = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];
  return generateSlidingMoves(row, col, color, directions);
}

function generateQueenMoves(row, col, color) {
  return [
    ...generateRookMoves(row, col, color),
    ...generateBishopMoves(row, col, color),
  ];
}

function generateKnightMoves(row, col, color) {
  const moves = [];
  const jumps = [
    [-2, -1], [-2, 1],
    [-1, -2], [-1, 2],
    [1, -2], [1, 2],
    [2, -1], [2, 1],
  ];

  for (const [dr, dc] of jumps) {
    const r = row + dr;
    const c = col + dc;
    if (!isOnBoard(r, c)) continue;
    const target = board[r][c];
    if (!target || target[0] !== color) {
      moves.push({ row: r, col: c });
    }
  }

  return moves;
}

function generateKingMoves(row, col, color) {
  const moves = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr;
      const c = col + dc;
      if (!isOnBoard(r, c)) continue;
      const target = board[r][c];
      if (!target || target[0] !== color) {
        moves.push({ row: r, col: c });
      }
    }
  }
  return moves;
}

resetButton.addEventListener('click', newGame);

newGame();
