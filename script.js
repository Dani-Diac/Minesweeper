var timerStatus;
var seconds = 0;
var flags = 0;
var clickedCell = false;

function createGrid(height, width, numberOfBombs) {
  document.getElementById("numberOfFlags").innerHTML = numberOfBombs;
  const grid = document.getElementsByClassName("grid")[0];
  const table =  Array.from({ length: height + 2 }, () => Array.from({ length: width + 2 }, () => -1));
  const bombsPosition = [];
  flags = numberOfBombs;
  for (let i = 1; i <= height; ++i) {
    for (let j = 1; j <= width; ++j) {
      table[i][j] = 0;
      const cell = document.createElement("div");
      grid.appendChild(cell);
      cell.className = "cells";
      cell.id = i + "." + j;
      cell.onclick = function() {checkCell(i, j, width, table, bombsPosition)};
      cell.oncontextmenu = function() {setFlag(i, j, width, table)};
      window.oncontextmenu = (e) => {
        e.preventDefault();
      }
    }
    let row = document.createElement("div");
    row.className = "clear";
    grid.appendChild(row);
  }
  placeBombs(numberOfBombs, height, width, table, bombsPosition);
  countBombsAround(height, width, table);
}

function timer() {
  let timer = document.getElementById("timer");
  seconds++;
  if (seconds < 10) {
    timer.innerHTML = "00" + seconds;
  } else if (seconds < 100) {
      timer.innerHTML = "0" + seconds;
  } else if (seconds > 99) {
      timer.innerHTML = seconds;
  }
}

function stopTimer() {
  clearInterval(timerStatus);
}

function setFlag(i, j, width, table) {
  if (document.getElementById(i + "." + j).innerHTML != "🚩" && table[i][j] != -1) {
    if (flags > 0) {
      document.getElementById("numberOfFlags").innerHTML = --flags;
      document.getElementById(i + "." + j).value = table[i][j];
      table[i][j] = "flag";
      document.getElementById(i + "." + j).innerHTML = "🚩";
      return true;
    }
  } else if (table[i][j] == "flag") {
    document.getElementById("numberOfFlags").innerHTML = ++flags;
    document.getElementById(i + "." + j).innerHTML = " ";
    table[i][j] = document.getElementById(i + "." + j).value;
    return false;
  }
}

function placeBombs(numberOfBombs, height, width, table, bombsPosition) {
  let randomX = Math.floor(Math.random() * (height - 1 + 1) + 1);
  let randomY = Math.floor(Math.random() * (width - 1 + 1) + 1);
  if(table[randomX][randomY] != "bomb" && numberOfBombs > 0) {
    table[randomX][randomY] = "bomb";
    bombsPosition[numberOfBombs] = randomX + "." + randomY;
    --numberOfBombs;
    placeBombs(numberOfBombs, height, width, table, bombsPosition);
  } else if (numberOfBombs > 0) {
    placeBombs(numberOfBombs, height, width, table, bombsPosition);
  }
}

function countBombsAround(height, width, table) {
  for (let i = 1; i <= height; ++i) {
    for (let j = 1; j <= width; ++j) {
      if (table[i][j] == 0) {
        for (let k = i - 1; k <= i + 1; ++k) {
          for (let p = j - 1; p <= j + 1; ++p) {
            if (table[k][p] == "bomb") {
              ++table[i][j];
            }
          }
        }
      }
    }
  }
}

function checkCell(row, column, width, table, bombsPosition) {
  if (!clickedCell) {
    timerStatus = setInterval(timer, 1000);
    clickedCell = true;
  }
  if (table[row][column] > 0) {
    document.getElementById(row + "." + column).innerHTML = table[row][column];
    document.getElementById(row + "." + column).style = "background-color: #DCDCDC";
    table[row][column] = -1;
    if (checkWin(table, width)) {
      document.getElementsByClassName("restart")[0].value = "🤩";
      endGame(table, width);
    }
  }
  if (table[row][column] == "bomb") {
    document.getElementById(row + "." + column).style = "background-color: red";
    document.getElementById(row + "." + column).innerHTML = "💣";
    revealBombs(bombsPosition, row, column, table);
    endGame(table, width);
  } else if (table[row][column] == 0) {
    revealCells(table, row, column)
  }
}

function revealCells(table, row, column) {
  for (let k = row - 1; k <= row + 1; ++k) {
    for (let p = column - 1; p <= column + 1; ++p) {
      if (table[k][p] > 0) {
        document.getElementById(k + "." + p).innerHTML = table[k][p];
        document.getElementById(k + "." + p).style = "background-color: #DCDCDC";
        table[k][p] = -1;
      }
      if (table[k][p] == 0 || table[k][p] == "flag") {
        if (table[k][p] == "flag") {
          document.getElementById("numberOfFlags").innerHTML = ++flags;
        }
        document.getElementById(k + "." + p).innerHTML = " ";
        document.getElementById(k + "." + p).style = "background-color: #DCDCDC";
        table[k][p] = -1;
        revealCells(table, k, p);
      }
    }
  }
}

function revealBombs(bombsPosition, row, column, table) {
  for (let i = bombsPosition.length - 1; i > 0; --i) {
    if (bombsPosition[i] != row + "." + column) {
      document.getElementById(bombsPosition[i]).style = "background-color: #DCDCDC";
      document.getElementById(bombsPosition[i]).innerHTML = "💣";
    }
  }
  document.getElementsByClassName("restart")[0].value = "☠️";
}

function checkWin(table, width) {
  for (let i = 1; i < table.length - 1; ++i) {
    for (let j = 1; j <= width; ++j) {
      if (table[i][j] > 0) {
        return false;
      }
    }
  }
  return true;
}

function endGame(table, width) {
  for (let i = 1; i < table.length - 1; ++i) {
    for (let j = 1; j <= width; ++j) {
      table[i][j] = -1;
    }
  }
  stopTimer();
}
