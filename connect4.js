/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;
let count = 0;
let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
function makeBoard() {
  //set "board" to empty HEIGHT x WIDTH matrix array
  for(let y = 0; y < HEIGHT; y++) {
    board.push(Array(WIDTH).fill(null));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById('board')
  // add event listener and id to column top
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // for every y, make a new row and fill with labeled td's
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
// need some help with this section
function findSpotForCol(x) {
  for(let y=HEIGHT-1; y>=0; y--){
    if(!board[y][x]){
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // make a div and insert into correct table cell
  const div = document.createElement('div');
  div.classList.add('piece');
  div.classList.add(`player${currPlayer}`);

  const cell = document.getElementById(`${y}-${x}`);
  cell.append(div);
}

/** endGame: announce game end */
function endGame(msg) {
  //pop up alert message
  alert(msg);
  resetBoard();
}

// resets board after win or tie
function resetBoard(){
  location.reload();
}

// building a forced reset button
const resetBtn = document.getElementById('reset-button');
resetBtn.addEventListener('click', resetBoard);

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  const x = +evt.target.id;
  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }
  // update player announce text
  const playerAnnounce = document.getElementById('player-announce');
  if(currPlayer === 1){
  playerAnnounce.innerText = "Player 2's Turn";
  }
  if(currPlayer === 2) {
    playerAnnounce.innerText = "Player 1's Turn";
  }
  // place piece in board and add to HTML table
  // add line to update in-memory board
  placeInTable(y, x);
  board[y][x] = currPlayer;
  count++;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // check if all cells in board are filled; if so call, call endGame
  // could not figure out succesful 'every' function.
  if(count === HEIGHT * WIDTH) {
    return endGame(`Tie game!`);
  }
  // switch players
  // ternary function to switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */
function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // checks for win along x axis
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      // checks for win along y axis
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      // checks for win up and to the right
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      // checks for win up and to the left
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
