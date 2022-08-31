import { useEffect, useState } from 'react';
import './App.css';

const initialBoard = [
  [2, 128, 128, 2],
  [0, 2, 0, 2],
  [0, 2, 0, 4],
  [2, 4096, 4096, 4],
  // [2, 2, 2, 2],
  // [2, 2, 2, 2],
  // [2, 2, 2, 2],
  // [2, 2, 2, 2],
  // [0, 2, 4, 0],
  // [0, 2, 4, 0],
  // [0, 2, 4, 0],
  // [0, 2, 4, 0],
]

function App() {
  const [board, setBoard] = useState(initialBoard)
  const [score, setScore] = useState(0)
  const [isHaveZero, SetIsHaveZero] = useState('')
  let point = score;

  useEffect(() => {
    if (board.join().includes(0)) {
      SetIsHaveZero(true)
    } else {
      SetIsHaveZero(false)
    }
  },[board]);
  
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

  const slideLeft = () => {
    const newBoard = []
    for (let i = 0; i < 4; i++) {
      newBoard[i] = slide(board[i]);
    }
    setBoard(newBoard);
  };

  const slideRight = () => {
    const newBoard = [];
    for (let i = 0; i < 4; i++) {
      newBoard[i] = slide(board[i].reverse());
      newBoard[i] = newBoard[i].reverse();
    }
    setBoard(newBoard);
  };

  const slideUp = () => {
    const newBoard = [[], [], [], []];
    for (let i = 0; i < 4; i++) {
      let row = [board[0][i], board[1][i], board[2][i], board[3][i]];
      row = slide(row);
      newBoard[0][i] = row[0]
      newBoard[1][i] = row[1]
      newBoard[2][i] = row[2]
      newBoard[3][i] = row[3]
    }
    setBoard(newBoard)
  }

  const slideDown = () => {
    const newBoard = [[], [], [], []];
    for (let i = 0; i < 4; i++) {
      let row = [board[0][i], board[1][i], board[2][i], board[3][i]];
      console.log('slideUp', row)
      row.reverse()
      row = slide(row);
      row.reverse()
      console.log('slideUp after slide', row)
      console.log('newBoard after slide', newBoard)
      newBoard[0][i] = row[0]
      newBoard[1][i] = row[1]
      newBoard[2][i] = row[2]
      newBoard[3][i] = row[3]
    }
    setBoard(newBoard)
  }

  const swipeDirection = (code) => {
    switch (code) {
      case 'ArrowUp': 
      console.log('Up')
      slideUp()
        break;

      case 'ArrowDown': 
      console.log('Down')
      slideDown()
        break;

      case 'ArrowLeft': 
      console.log('Left')
      slideLeft()
        break;

      case 'ArrowRight': 
      console.log('Right')
      slideRight()
        break;
    
      default:
        break;
    }
  };

  return (
    <div tabIndex={0} onKeyDown={(e) => swipeDirection(e.code)} className="App">
      <h1>2048 Game</h1>
      <button>new game</button>
      <div className="score">{score}</div>
      <div className="board">
        {board.map((row, index) => {
          return <div className='board__row' key={index}>
            {row.map((num, i) =>
              <div key={i} className={`title color-${num}`}>{num !== 0 ? num : null}</div>
            )}
          </div>
        })}
      </div>
    </div>
  );
};

export default App;
