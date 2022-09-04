import { useEffect, useState } from 'react';
import './App.css';

const initialBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]

const addNumber = (newBoard) => {
  let found = false
  while (!found) {
    let row = Math.floor(Math.random() * 4)
    let col = Math.floor(Math.random() * 4)
    let addDigit = 0;

    if (Math.random() < 0.9) {
      addDigit = 2;
    } else {
      addDigit = 4;
    }
    
    if (newBoard[row][col] === 0) {
      newBoard[row][col] = addDigit;
      found = true;
    }
  }
}

addNumber(initialBoard)
addNumber(initialBoard)

function App() {
  const [board, setBoard] = useState(initialBoard)
  const [score, setScore] = useState(0)
  const [maxScore, setMaxScore] = useState(JSON.parse(localStorage.getItem('maxScore')) || {score: 0})
  const [isHaveZero, setIsHaveZero] = useState(true)
  const [isGameOver, setIsGameOver] = useState(false)
  const [isGameWin, setIsGameWin] = useState(false)
  const [isGameWinShow, setIsGameWinShow] = useState(true)

  let point = score;

  const newGame = () => {
    setBoard(initialBoard)
    setScore(0)
    setIsGameOver(false)
  }

  useEffect(() => {
    if (score >= maxScore.score) {
      setMaxScore({score: score})
    }
    if (score >= 2048) {
      setIsGameWin(true)
    }
  },[maxScore.score, score])

  useEffect(() => {
      localStorage.setItem('maxScore', JSON.stringify(maxScore));
  },[maxScore, maxScore.score])


  useEffect(() => {
    if (board.flat().includes(0)) {
      setIsHaveZero(true)
    } else {
      setIsHaveZero(false)
    }
  },[board]);
  
  useEffect(() => {
    if (!isHaveZero) {
      let isRowMoveAvailable = false;
      let isColumnMoveAvailable = false;

      for (let i = 0; i < 4; i++) {
        for(let k = 0; k < 3; k++) {
          if (board[i][k] === board[i][k + 1]) {
            isRowMoveAvailable = true
          }
        }
      }
  
      for (let i = 0; i < 4; i++) {
        for(let k = 0; k < 3; k++) {
          if (board[k][i] === board[k + 1][i]) {
            isColumnMoveAvailable = true;
          }
        }
      }

      if (!isColumnMoveAvailable && !isRowMoveAvailable) {
        setIsGameOver(true)
      }
    }
  }, [board, isHaveZero])

  const toggleWin = () => {
    setIsGameWinShow(false)
  }
  
  const filteredZero = (row) => {
    return row.filter(num => num !== 0)
  };
  
  const slide = (row) => {
    row = filteredZero(row);
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
        point = point + row[i] / 2
      }
      setScore(point)
    }
    row = filteredZero(row)
    while (row.length < 4) {
      row.push(0)
    }
    return row;
  };

  const setNumber = (newBoard, board) => {
    if (board.flat().join() !== newBoard.flat().join()) {
      addNumber(newBoard)
    }
  };

  const slideLeft = () => {
    const newBoard = []
    for (let i = 0; i < 4; i++) {
      newBoard[i] = slide(board[i]);
    }

    setNumber(newBoard, board)
    setBoard(newBoard);
  };

  const slideRight = () => {
    const newBoard = [[], [], [], []];
    for (let i = 0; i < 4; i++) {
      let row = [];
      for (let k = 0; k < 4; k++) {
        row.push(board[i][k]);
      }
      row.reverse();
      row = slide(row);
      row.reverse();
      for (let r = 0; r < 4; r++) {
        newBoard[i][r] = row[r];
      }
    }
  
    setNumber(newBoard, board)
    setBoard(newBoard);
  };

  const slideUp = () => {
    const newBoard = [[], [], [], []];
    for (let i = 0; i < 4; i++) {
      let row = [];
      for (let k = 0; k < 4; k++) {
        row.push(board[k][i]);
      }
      row = slide(row);
      for (let r = 0; r < 4; r++) {
        newBoard[r][i] = row[r];
      }
    }

    setNumber(newBoard, board)
    setBoard(newBoard);
  };

  const slideDown = () => {
    const newBoard = [[], [], [], []];
    for (let i = 0; i < 4; i++) {
      let row = [];
      for (let k = 0; k < 4; k++) {
        row.push(board[k][i]);
      }
      row.reverse();
      row = slide(row);
      row.reverse();
      for (let r = 0; r < 4; r++) {
        newBoard[r][i] = row[r];
      }
    }

    setNumber(newBoard, board)
    setBoard(newBoard);
  };

  const swipeDirection = (code) => {
    switch (code) {
      case 'ArrowUp': 
      slideUp()
        break;

      case 'ArrowDown': 
      slideDown()
        break;

      case 'ArrowLeft': 
      slideLeft()
        break;

      case 'ArrowRight': 
      slideRight()
        break;
    
      default:
        break;
    }
  };

  return (
    <div tabIndex={0} onKeyDown={(e) => swipeDirection(e.code)} className="App">

      <div className='header'>
        <div className='title'>2048</div>
        <div className='activ'>
          <div className='score-card'>
            <div className="score">
              score
              <br />
              {score}</div>
            <div className='max-score'>
              max score
              <br />
              {maxScore.score}
            </div>
          </div>
          <button className='button' onClick={() => {newGame()}}>
            {isGameOver ? 'new game' : 'restart game'}
            </button>
        </div>
      </div>
      
      <div className="board">
        {board.map((row, index) => {
          return <div className='board__row' key={index}>
            {row.map((num, i) =>
              <div key={i} className={`tile color-${num}`}>{num !== 0 ? num : null}</div>
            )}
          </div>
        })}
      </div>
      {isGameOver && <div className="board game-over">Game over</div>}
      {isGameWin && isGameWinShow && <div onClick={() => toggleWin()} className="board game-over">You Win! Click for continue</div>}
    </div>
  );
};

export default App;
