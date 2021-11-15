import React, { useEffect, useState } from "react";

const App = () => {
  const [grid, setGrid] = useState([[]]);
  const [row, setRow] = useState(50);
  const [column, setColumn] = useState(50);
  const [colCount, setColCount] = useState(50)
  const [gameStarted, setGameStarted] = useState(false);
  const [lockSeeding, setLockSeeding] = useState(false);
  const [gen, setGen] = useState(0);

  useEffect(() => {
    setGrid(intializeGrid(row, column));
  }, []);

  useEffect(() => {
    if (gameStarted) {
      setTimeout(() => {
        updateGrid(grid);
      }, 500);
    }
  }, [grid]);

  const createGrid = () => {
    setColCount(column)
    setGrid(intializeGrid(parseInt(row), parseInt(column)));
  };

  const intializeGrid = (row = 10, column = 10) => {
    const gridArr = [];
    for (let i = 0; i < row; i++) {
      let rowArr = new Array(column).fill(0);
      gridArr.push(rowArr);
    }

    return gridArr;
  };

  const seedBox = (row, column) => {
    setGrid((grid) => {
      const gridClone = JSON.parse(JSON.stringify(grid));
      if (gridClone[row][column]) {
        gridClone[row][column] = 0;
      } else {
        gridClone[row][column] = 1;
      }
      return gridClone;
    });
  };

  const startGameOfLife = () => {
    setLockSeeding(true);
    setGameStarted(true);
    updateGrid(grid);
  };

  const updateGrid = (grid) => {
    const gridClone = JSON.parse(JSON.stringify(grid));
    gridClone.forEach((gridRow, i) => {
      gridRow.forEach((box, j) => {
        let liveNeighbourCount = 0;

        if (j - 1 !== -1 && grid[i][j - 1]) liveNeighbourCount += 1;
        if (j + 1 !== parseInt(column) && grid[i][j + 1])
          liveNeighbourCount += 1;
        if (i - 1 !== -1 && j - 1 !== -1 && grid[i - 1][j - 1]) {
          liveNeighbourCount += 1;
        }
        if (i - 1 !== -1 && j + 1 !== parseInt(column) && grid[i - 1][j + 1]) {
          liveNeighbourCount += 1;
        }
        if (i + 1 !== parseInt(row) && j - 1 !== -1 && grid[i + 1][j - 1]) {
          liveNeighbourCount += 1;
        }
        if (
          i + 1 !== parseInt(row) &&
          j + 1 !== parseInt(column) &&
          grid[i + 1][j + 1]
        ) {
          liveNeighbourCount += 1;
        }
        if (i - 1 !== -1 && grid[i - 1][j]) liveNeighbourCount += 1;
        if (i + 1 !== parseInt(row) && grid[i + 1][j]) liveNeighbourCount += 1;

        if (liveNeighbourCount < 2 || liveNeighbourCount > 3) {
          gridClone[i][j] = 0;
        }
        if (liveNeighbourCount === 3) {
          gridClone[i][j] = 1;
        }
      });
    });
    setGrid(gridClone);
    setGen((gen) => gen + 1);
    if (JSON.stringify(gridClone) === JSON.stringify(grid)) {
      setGameStarted(false);
    }
  };
  return (
    <div className="main-app center">
      <div className="row-col-input">
        <span>Grid Size: </span>
        <input
          type="number"
          value={row}
          onChange={(e) => setRow(parseInt(e.target.value))}
        />
        <span>X</span>
        <input
          type="number"
          value={column}
          onChange={(e) => setColumn(parseInt(e.target.value))}
        />
      </div>
      <div className="create-grid-btn">
        <button
          className={`btn green ${lockSeeding ? "disabled" : ""}`}
          onClick={createGrid}
        >
          Create Grid
        </button>
        {gen !== 0 && <span className="gen-num">{`Current Generation: ${gen}`}</span>}
      </div>
      <div className="gol-container" style={{ minWidth: `${colCount * 15}px` }}>
        <div className="grid-container" style={{ width: `${colCount * 15}px` }}>
          {grid.map((row, i) => {
            return row.map((box, j) => {
              const alive = grid[i][j];
              return (
                <div
                  key={`${i}:${j}`}
                  className={`box ${alive ? "black" : ""}`}
                  onClick={lockSeeding ? () => {} : () => seedBox(i, j)}
                ></div>
              );
            });
          })}
        </div>
      </div>

      <div className="cta-container">
        <button
          className="btn restart-btn"
          onClick={() => {
            setTimeout(() => {
              setGrid(intializeGrid(row, column));
              setGameStarted(false);
              setLockSeeding(false);
              setTimeout(() => setGen(0),500)
            }, 501);
          }}
        >
          Reset
        </button>
        <button
          className={`btn green ${lockSeeding ? "disabled" : ""}`}
          onClick={startGameOfLife}
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default App;
