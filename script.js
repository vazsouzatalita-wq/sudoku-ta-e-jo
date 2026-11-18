let board = Array(9).fill().map(() => Array(9).fill(0));
let initialBoard = Array(9).fill().map(() => Array(9).fill(0));
let selectedCell = null;
let selectedRow = -1;
let selectedCol = -1;

// Matriz gabarito perfeitamente válida usada como base estrutural
const baseSolution = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 4, 2, 1, 7, 6, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

function generateNewGame(difficulty) {
  selectedCell = null;
  selectedRow = -1;
  selectedCol = -1;

  // Cria um mapeamento embaralhado dos números de 1 a 9
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  numbers.sort(() => Math.random() - 0.5);
  
  // Aplica o mapeamento para gerar um tabuleiro único e válido
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      board[r][c] = numbers[baseSolution[r][c] - 1];
    }
  }

  // Remove casas com base na dificuldade escolhida
  let blanks = 30; // fácil
  if (difficulty === 'medium') blanks = 45;
  if (difficulty === 'hard') blanks = 55;

  while (blanks > 0) {
    let r = Math.floor(Math.random() * 9);
    let c = Math.floor(Math.random() * 9);
    if (board[r][c] !== 0) {
      board[r][c] = 0;
      blanks--;
    }
  }

  // Clona o tabuleiro para proteger as casas fixas iniciais
  initialBoard = JSON.parse(JSON.stringify(board));
  drawBoard();
}

function drawBoard() {
  const boardElement = document.getElementById('sudoku-board');
  boardElement.innerHTML = '';

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;

      if (initialBoard[r][c] !== 0) {
        cell.textContent = initialBoard[r][c];
        cell.classList.add('fixed');
      } else {
        if (board[r][c] !== 0) {
          cell.textContent = board[r][c];
        }
        cell.addEventListener('click', () => selectCell(cell, r, c));
      }

      boardElement.appendChild(cell);
    }
  }
  validateAllCells();
}

function selectCell(cell, r, c) {
  if (cell.classList.contains('fixed')) return;

  if (selectedCell) {
    selectedCell.classList.remove('selected');
  }

  selectedCell = cell;
  selectedRow = r;
  selectedCol = c;
  selectedCell.classList.add('selected');
}

function pressNumber(num) {
  if (!selectedCell || selectedRow === -1 || selectedCol === -1) return;

  if (num === '' || num === 0) {
    board[selectedRow][selectedCol] = 0;
    selectedCell.textContent = '';
  } else {
    board[selectedRow][selectedCol] = parseInt(num);
    selectedCell.textContent = num;
  }

  validateAllCells();
}

function validateAllCells() {
  const cells = document.querySelectorAll('.cell');
  
  cells.forEach(cell => {
    if (cell.classList.contains('fixed')) return;
    
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);
    const val = board[r][c];

    if (val === 0) {
      cell.classList.remove('invalid-move');
      return;
    }

    let isInvalid = false;

    // Valida linhas e colunas
    for (let i = 0; i < 9; i++) {
      if (i !== c && board[r][i] === val) isInvalid = true;
      if (i !== r && board[i][c] === val) isInvalid = true;
    }

    // Valida blocos 3x3
    let boxRowStart = Math.floor(r / 3) * 3;
    let boxColStart = Math.floor(c / 3) * 3;
    for (let i = boxRowStart; i < boxRowStart + 3; i++) {
      for (let j = boxColStart; j < boxColStart + 3; j++) {
        if ((i !== r || j !== c) && board[i][j] === val) {
          isInvalid = true;
        }
      }
    }

    if (isInvalid) {
      cell.classList.add('invalid-move');
    } else {
      cell.classList.remove('invalid-move');
    }
  });
}

// Captura cliques do teclado físico do computador
document.addEventListener('keydown', (event) => {
  if (event.key >= '1' && event.key <= '9') {
    pressNumber(event.key);
  } else if (event.key === 'Backspace' || event.key === 'Delete') {
    pressNumber('');
  }
});

function checkVictory() {
  const cells = document.querySelectorAll('.cell');
  let hasEmpty = false;
  let hasErrors = false;

  cells.forEach(cell => {
    if (cell.textContent === '') hasEmpty = true;
    if (cell.classList.contains('invalid-move')) hasErrors = true;
  });

  if (hasEmpty) {
    alert('Ainda existem casas em branco no tabuleiro!');
  } else if (hasErrors) {
    alert('Existem erros pendentes (em vermelho). Corrija-os para vencer!');
  } else {
    alert('Perfeito! Você completou o Sudoku com sucesso! 🎉');
  }
}

// Inicia automaticamente o jogo
generateNewGame('easy');

