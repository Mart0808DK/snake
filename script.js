import { Queue } from "./queue.js";
import { Grid } from "./grid.js";

window.addEventListener("load", init);

const GRID_HEIGHT = 20;
const GRID_WIDTH = 30;
let currentDirection = "right";
let score = 0;
let grid;
let gameOver = false;

function init() {
    console.log(`Init kører`);
    createTheGrid();
    displayFood();
    displayGrid();
    document.addEventListener("keydown", keyDown);
    tick();
}

// ****** CONTROLLER ******
// #region controller
function updateDirection(newDirection) {
    if (
        (currentDirection === "left" && newDirection !== "right") ||
        (currentDirection === "right" && newDirection !== "left") ||
        (currentDirection === "up" && newDirection !== "down") ||
        (currentDirection === "down" && newDirection !== "up")
    ) {
        currentDirection = newDirection;
    }
}

function keyDown(event) {
    switch (event.key) {
        case "ArrowLeft":
        case "a":
            updateDirection("left");
            break;
        case "ArrowRight":
        case "d":
            updateDirection("right");
            break;
        case "ArrowUp":
        case "w":
            updateDirection("up");
            break;
        case "ArrowDown":
        case "s":
            updateDirection("down");
            break;
        default:
            break;
    }
}

function tick() {
    if (gameOver) {
        console.log(`Game over! Score: ${score}`);
        alert(`Game over! Score: ${score}`);
        window.location.reload(); // reload the page
        return;
    }
    setTimeout(tick, 100);

    let current = queue.head;

    while (current) {
        grid.set(current.data.row, current.data.col, 0);
        current = current.next;
    }
    let head = {
        row: queue.tail.data.row,
        col: queue.tail.data.col,
    };

    queue.dequeue();

    // Move the head based on the direction
    switch (currentDirection) {
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
    checkIfSnakeIsInCell(head.row, head.col);

    if (grid.get(head.row, head.col) === 3) {
        console.log("BANG - cell is inside obstacle");
        gameOver = true;
        return;
        
    }

    if (grid.get(head.row, head.col) === 2) {
        score += 10;
        queue.enqueue({ row: queue.tail.data.row, col: queue.tail.data.col });
        grid.set(head.row, head.col, 1);
        displayScore(score);
        console.log(`Score: ${score}`);
        displayObstacle();

        setTimeout(() => {
            displayFood();
        }, 1000);
    }

    queue.enqueue(head);

    current = queue.head;
    while (current) {
        grid.set(current.data.row, current.data.col, 1);
        current = current.next;
    }

    updateGrid();
}

function checkIfSnakeIsInCell(row, col) {
    let node = queue.head;
    while (node) {
        if (node.data.row === row && node.data.col === col) {
            if (node != queue.head) {
                console.log("BANG - cell is inside snake");
                gameOver = true;
                return true;
            }
        }
        node = node.next;
    }
    return false;
}

function updateGrid() {
    const cells = document.querySelectorAll("#grid .cell");
    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            const index = row * GRID_WIDTH + col;

            switch (grid.get(row, col)) {
                case 0:
                    cells[index].classList.remove("player", "goal", "obstacle");
                    break;
                case 1: // Note: doesn't remove goal if previously set
                    cells[index].classList.add("player");
                    break;
                case 2: // Note: doesn't remove player if previously set
                    cells[index].classList.add("goal");
                    break;
                case 3:
                    cells[index].classList.add("obstacle");
                    break;
            }
        }
    }
}
// #endregion controller

// ****** MODEL ******
// #region model

function createTheGrid() {
    grid = new Grid(GRID_HEIGHT, GRID_WIDTH);
    grid.fill(0);
}

let queue = new Queue();
queue.enqueue({ row: 5, col: 5 });
queue.enqueue({ row: 5, col: 6 });
queue.enqueue({ row: 5, col: 7 });

function emptyCells() {
    let emptyCells = [];
    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            if (grid.get(row, col) === 0) {
                emptyCells.push({ row, col });
            }
        }
    }
    return emptyCells;
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

function displayFood() {
    let empty = emptyCells();
    let randomIndex = Math.floor(Math.random() * empty.length);
    let randomCell = empty[randomIndex];
    grid.set(randomCell.row, randomCell.col, 2);
}

function displayObstacle() {
    let empty = emptyCells();
    let randomIndex = Math.floor(Math.random() * empty.length);
    let randomCell = empty[randomIndex];
    grid.set(randomCell.row, randomCell.col, 3);
}

function displayScore(score) {
    const scoreElement = document.querySelector("#score");
    scoreElement.textContent = `Score: ${score}`;
}
// #endregion view
