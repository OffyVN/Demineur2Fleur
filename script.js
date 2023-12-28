//const gameBoard = [];
//const boardSize = 10; // Taille 10x10 par exemple
//for(let i = 0; i < boardSize; i++) {
//  gameBoard[i] = [];
//  for(let j = 0; j < boardSize; j++) {
//    gameBoard[i][j] = 0; // 0 représente une case vide
//  }
//}

let startTime;

function startGame() {
  const width = parseInt(document.getElementById('width').value);
  const height = parseInt(document.getElementById('height').value);
  const totalCells = width * height;
  const minesCount = Math.floor(totalCells * (Math.random() * 0.1 + 0.1)); // 10% à 20%

  initializeBoard(width, height, minesCount);
  startTime = new Date(); // Enregistrer le début du jeu
}


function initializeBoard(width, height, minesCount) {
  const gameBoard = document.getElementById('gameBoard');
  gameBoard.style.gridTemplateColumns = `repeat(${width}, 20px)`;
  gameBoard.innerHTML = '';
  const mineArray = generateMinesArray(width, height, minesCount);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = document.createElement('div');
      cell.id = `cell-${y}-${x}`; // Assignation d'un ID unique
      cell.classList.add('case');
      cell.addEventListener('click', () => {
        if (!cell.classList.contains('flagged')) {
          revealCell(cell, mineArray, x, y, width, height);
        }
      });
      cell.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        toggleFlag(cell);
      });
      gameBoard.appendChild(cell);
    }
  }
}

function toggleFlag(cell) {
  if (cell.classList.contains('flagged')) {
    cell.classList.remove('flagged');
    cell.innerHTML = ''; // Enlève le drapeau
  } else {
    cell.classList.add('flagged');
    cell.innerHTML = '🚩'; // Place un drapeau
  }
}

function generateMinesArray(width, height, minesCount) {
  const mineArray = Array.from({ length: height }, () => Array(width).fill(0));
  let minesPlaced = 0;
  
  while (minesPlaced < minesCount) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);

    if (mineArray[y][x] !== 'M') {
      mineArray[y][x] = 'M';
      minesPlaced++;
    }
  }

  return mineArray;
}

function revealCell(cell, mineArray, x, y) {
  if (cell.classList.contains('revealed') || cell.classList.contains('flagged')) {
    return; // Ne fait rien si la cellule est déjà révélée ou marquée
  }

  const minesAround = countMinesAround(mineArray, x, y);
  cell.classList.add('revealed');
  cell.style.pointerEvents = 'none'; // Désactive les clics supplémentaires sur cette cellule

  if (mineArray[y][x] === 'M') {
    cell.textContent = '💣';
    cell.style.backgroundColor = 'red';
    explode(cell); // Fonction pour simuler l'explosion
    endGame(mineArray, width, height); // Fonction pour terminer le jeu

  } else if (minesAround === 0) {
//    cell.style.color = 'grey';
    cell.textContent = '0';
    revealAdjacentCells(mineArray, x, y, width, height); // Modifié pour inclure width et height
  } else {
    cell.textContent = minesAround;
    colorCell(cell, minesAround);
  }
}

function revealAdjacentCells(mineArray, x, y, width, height) {
  const positions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  positions.forEach(([dx, dy]) => {
    const newX = x + dx, newY = y + dy;
   if (newX >= 0 && newX < mineArray[0].length && newY >= 0 && newY < mineArray.length) {
      const adjacentCell = document.getElementById(`cell-${newY}-${newX}`);
      if (adjacentCell && !adjacentCell.classList.contains('revealed')) {
        revealCell(adjacentCell, mineArray, newX, newY, width, height);
      }
    }
  });
}


function colorCell(cell, minesAround) {
  switch(minesAround) {
    case 0: cell.style.color = 'grey'; break;
    case 1: cell.style.color = 'green'; break;
    case 2: cell.style.color = 'blue'; break;
    case 3: cell.style.color = 'orange'; break;
    case 4: cell.style.color = 'red'; break;
    case 5: cell.style.color = 'red'; break;
    // Ajoute d'autres couleurs si nécessaire
  }
}


function countMinesAround(mineArray, x, y) {
  const positions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  return positions.reduce((count, [dx, dy]) => {
    const newX = x + dx, newY = y + dy;
    if (newX >= 0 && newX < mineArray[0].length && newY >= 0 && newY < mineArray.length) {
      if (mineArray[newY][newX] === 'M') {
        count++;
      }
    }
    return count;
  }, 0);
}

function endGame(mineArray, width, height) {
  for (let y = 0; y < mineArray.length; y++) {
    for (let x = 0; x < mineArray[0].length; x++) {
      const cell = document.getElementById(`cell-${y}-${x}`);
      if (mineArray[y][x] === 'M' && !cell.classList.contains('revealed')) {
        cell.innerHTML = '💣';
      }
      cell.style.pointerEvents = 'none';
    }
  }
  const endTime = new Date();
  const duration = Math.round((endTime - startTime) / 1000); // Durée en secondes
  alert(`Partie terminée ! Durée de la partie : ${duration} secondes.`);

}

function explode(cell) {
  cell.classList.add('explode');
}