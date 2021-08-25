var timerStatus;
var seconds = 0;
var flagsPosition = [];
var flags = 0;

function createGrid(width, height, numberOfBombs, btnId) {
  document.getElementById("numberOfFlags").innerHTML = numberOfBombs;
  const grid = document.getElementsByClassName("grid")[0];
  const table =  Array.from({ length: height + 2 }, () => Array.from({ length: width + 2 }, () => -1));
  const bombsPosition = [];
  const isWin = null;
  var clickedCell = 0;
  flags = numberOfBombs;
  if (width == height) {
    grid.style.width = "216px";
    grid.style.height = "216px";
  }
  if (width == 16) {
    grid.style.width = "384px";
    grid.style.height = "384px";
  }
  if (width != height) {
    grid.style.width = "705px";
    grid.style.height = "360px";
  }
  for (let i = 1; i <= height; ++i) {
    for (let j = 1; j <= width; ++j) {
      table[i][j] = 0;
      const cell = document.createElement("div");
      cell.setAttribute("id", i + "." + j);
      cell.addEventListener("click", function(e) {
        checkCell(i, j, width, table, bombsPosition, isWin);
      })
      cell.addEventListener("contextmenu", function(e) {
        if (!setFlag(i, j, table)) {
          cell.addEventListener("click", function(e) {
            checkCell(i, j, width, table, bombsPosition, isWin);
          })
        }
      })
      window.oncontextmenu = (e) => {
        e.preventDefault();
      }
      grid.appendChild(cell);
    }
  }
  placeBombs(numberOfBombs, width, height, table, bombsPosition);
  countBombsAround(width, height, table);
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

function setFlag(i, j, table) {
  if (document.getElementById(i + "." + j).innerHTML != "🚩" && table[i][j] != -1) {
    if (flags > 0) {
      document.getElementById("numberOfFlags").innerHTML = --flags;
      flagsPosition.push(i + "." + j);
      document.getElementById(i + "." + j).value = table[i][j];
      table[i][j] = "flag";
      document.getElementById(i + "." + j).innerHTML = "🚩";
      return true;
    }
  } else if (table[i][j] == "flag") {
    document.getElementById("numberOfFlags").innerHTML = ++flags;
    let index = flagsPosition.indexOf(i + "." + j);
    flagsPosition.splice(index, 1);
    document.getElementById(i + "." + j).innerHTML = " ";
    table[i][j] = document.getElementById(i + "." + j).value;
    return false;
  }
}

function placeBombs(numberOfBombs, width, height, table, bombsPosition) {
  let randomX;
  let randomY;
  if (width == height) {
    randomX = Math.floor(Math.random() * (height - 1 + 1) + 1);
    randomY = Math.floor(Math.random() * (height - 1 + 1) + 1);
  }
  if (width != height) {
    randomX = Math.floor(Math.random() * (height - 1 + 1) + 1);
    randomY = Math.floor(Math.random() * (width - 1 + 1) + 1);
  }
  if(table[randomX][randomY] != "bomb" && numberOfBombs > 0) {
    table[randomX][randomY] = "bomb";
    bombsPosition[numberOfBombs] = randomX + "." + randomY;
    --numberOfBombs;
    placeBombs(numberOfBombs, width, height, table, bombsPosition);
  } else if (numberOfBombs > 0) {
      placeBombs(numberOfBombs, width, height, table, bombsPosition);
  }
}

function countBombsAround(width, height, table) {
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

function checkCell(row, column, width, table, bombsPosition, isWin) {
  if (seconds == 0) {
    timerStatus = setInterval(timer, 1000);
  }
  if (table[row][column] > 0) {
    document.getElementById(row + "." + column).innerHTML = table[row][column];
    document.getElementById(row + "." + column).style = "background-color: #DCDCDC";
    table[row][column] = -1;
    if (checkWin(table, width, bombsPosition, isWin)) {
      document.getElementsByClassName("restart")[0].value = "🤩";
      stopTimer();
      endGame(table, bombsPosition);
      return;
    }
  }
  if (table[row][column] == "bomb") {
    document.getElementById(row + "." + column).style = "background-color: red";
    document.getElementById(row + "." + column).innerHTML = "💣";
    isWin = false;
    clickedCell = true;
    stopTimer();
    revealBombs(bombsPosition, row, column, table);
  } else if (table[row][column] == 0) {
    revealCells(table, row, column)
  }
}

function revealCells(table, row, column) {
  if (row == 0) {
    ++row;
  }
  if (column == 0) {
    ++column;
  }
  for (let k = row - 1; k <= row + 1; ++k) {
    for (let p = column - 1; p <= column + 1; ++p) {
      if (table[k][p] == 0 || table[k][p] == "flag") {
        document.getElementById(k + "." + p).innerHTML = " ";
        document.getElementById(k + "." + p).style = "background-color: #DCDCDC";
        table[k][p] = -1;
        revealCells(table, k, p);
      }
      if (table[k][p] > 0) {
        document.getElementById(k + "." + p).innerHTML = table[k][p];
        document.getElementById(k + "." + p).style = "background-color: #DCDCDC";
        table[k][p] = -1;
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
  endGame(table, bombsPosition);
}

function checkWin(table, width, bombsPosition, isWin) {
  for (let i = 1; i < table.length - 1; ++i) {
    for (let j = 1; j < width - 1; ++j) {
      if (bombsPosition.includes(i + "." + j)) {
        ++j;
        isWin = true;
      }
      if (table[i][j] > 0) {
        isWin = false;
        return isWin;
      }
    }
  }
  return isWin;
}

function endGame(table, bombs) {
  if (bombs.length < 50) {
    for (let i = 1; i < table.length - 1; ++i) {
      for (let j = 1; j < table.length - 1; ++j) {
        table[i][j] = -1;
      }
    }
  } else {
    for (let i = 1; i < table.length - 1; ++i) {
      for (let j = 1; j < 30; ++j) {
        table[i][j] = -1;
      }
    }
  }
  stopTimer();
}
