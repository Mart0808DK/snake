import { Queue } from "./queue.js";
import { Grid } from "./grid.js";

window.addEventListener("load", init);

const GRID_HEIGHT = 20;
const GRID_WIDTH = 30;
let direction;
let score = 0;
let grid;
let gameOver = false;

function init() {
    console.log(`Init kører`);
    createTheGrid();
    displayGoal();
    displayGrid();
    document.addEventListener("keydown", keyDown);
    tick();
}

// ****** CONTROLLER ******
// #region controller
function keyDown(event) {
    switch (event.key) {
        case "ArrowLeft":
        case "a":
            direction = "left";
            break;
        case "ArrowRight":
        case "d":
            direction = "right";
            break;
        case "ArrowUp":
        case "w":
            direction = "up";
            break;
        case "ArrowDown":
        case "s":
            direction = "down";
            break;
        default:
            break;
    }
}

function tick() {
    if (gameOver) {
        console.log(`Game over! Score: ${score}`);
        return;
    }
    setTimeout(tick, 100);

    let current = queue.head;
    while (current) {
        grid.set(current.data.row, current.data.col, 0);
        current = current.next;
    }
    const head = {
        row: queue.tail.data.row,
        col: queue.tail.data.col,
    };




    queue.dequeue();
   
    

    // Move the head based on the direction
    switch (direction) {
        case "left":
            head.col--;
            if (head.col < 0) {
                head.col = GRID_WIDTH - 1;
            }
            break;
        case "right":
            head.col++;
            if (head.col >= GRID_WIDTH) {
                head.col = 0;
            }
            break;
        case "up":
            head.row--;
            if (head.row < 0) {
                head.row = GRID_HEIGHT - 1;
            }
            break;
        case "down":
            head.row++;
            if (head.row >= GRID_HEIGHT) {
                head.row = 0;
            }
            break;
        default:
            break;
    }

    // Check if the head has hit the body



    if (grid.get(head.row, head.col) === 2) {
        queue.enqueue({ row: queue.tail.data.row, col: queue.tail.data.col });
        displayScore(score++)
        console.log(`Score: ${score}`);
        
        displayGoal();
    }

    queue.enqueue(head);

    current = queue.head;
    while (current) {
        grid.set(current.data.row, current.data.col, 1);
        current = current.next;
    }

    updateGrid();
}
// #endregion controller

// ****** MODEL ******
// #region model


function createTheGrid() {
    grid = new Grid(GRID_HEIGHT, GRID_WIDTH);
}

let queue = new Queue();
queue.enqueue({ row: 5, col: 5 });
queue.enqueue({ row: 5, col: 6 });
queue.enqueue({ row: 5, col: 7 });

function writeToCell(row, col, value) {
    grid[row][col] = value;
}

function readFromCell(row, col) {
    return grid[row][col];
}
// #endregion model

// ****** VIEW ******
// #region view
function displayGrid() {
    const board = document.querySelector("#grid");

    // this following will create cells in the grid
    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            const cell = document.createElement("div");
            board.style.setProperty("--GRID_WIDTH", GRID_WIDTH);
            board.style.setProperty("--GRID_HEIGHT", GRID_HEIGHT);
            cell.classList.add("cell");
            board.appendChild(cell);
        }
    }
}

function displayGoal() {
    const row = Math.floor(Math.random() * GRID_HEIGHT);
    const col = Math.floor(Math.random() * GRID_WIDTH);
    console.log(`row: ${row}, col: ${col}`);
    
    grid.set(row, col, 2);
}

function displayScore(score) {
    const scoreElement = document.querySelector("#score");
    scoreElement.textContent = `Score: ${score}`;
}

function updateGrid() {
    const cells = document.querySelectorAll("#grid .cell");
    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            const index = row * GRID_WIDTH + col;

            switch (grid.get(row, col)) {
                case 0:
                    cells[index].classList.remove("player", "goal");
                    break;
                case 1: // Note: doesn't remove goal if previously set
                    cells[index].classList.add("player");
                    break;
                case 2: // Note: doesn't remove player if previously set
                    cells[index].classList.add("goal");
                    break;
            }
        }
    }
}
// #endregion view
