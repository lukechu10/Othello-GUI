// @ts-nocheck
const othello = require("othello-bindings");

const game = new othello.Game();
/**
 * @type {HTMLDivElement}
 */
const gameBoardContainer = document.querySelector("#game-board-container");

function update() {
    // let whitePieces = BigInt(game.whitePieces);
    // let blackPieces = BigInt(game.blackPieces);

    // // update white pieces
    // let index = 0;
    // while (whitePieces !== 0n) {
    //     if (whitePieces % 2n == 1n) {
    //         const cellElem = document.querySelector(`.game-board-cell[data-cell-index="${index}"]`);
    //         if (!cellElem.classList.contains("white-cell")) {
    //             cellElem.classList.remove("black-cell");
    //             cellElem.classList.add("white-cell");
    //         }
    //     }
    //     whitePieces >>= 1n;
    //     index++;
    // }

    // // update black pieces
    // index = 0;
    // while (blackPieces !== 0n) {
    //     if (blackPieces % 2n == 1n) {
    //         const cellElem = document.querySelector(`.game-board-cell[data-cell-index="${index}"]`);
    //         if (!cellElem.classList.contains("black-cell")) {
    //             cellElem.classList.remove("white-cell");
    //             cellElem.classList.add("black-cell");
    //         }
    //     }
    //     blackPieces >>= 1n;
    //     index++;
    // }
    let string = game.toString();
    string = string.replaceAll("\n", ""); // remove line breaks
    console.log(string);

    for (let i = 0; i < 64; i++) {
        const cellElem = document.querySelector(`.game-board-cell[data-cell-index="${i}"]`);
        if (string[i] === "B") {
            if (!cellElem.classList.contains("black-cell")) {
                cellElem.classList.remove("white-cell");
                cellElem.classList.add("black-cell");
            }
        }
        else if (string[i] === "W") {
            if (!cellElem.classList.contains("white-cell")) {
                cellElem.classList.remove("black-cell");
                cellElem.classList.add("white-cell");
            }
        }
    }
}


function initialRender() {
    for (let i = 0; i < 8; i++) {
        const gameBoardRow = document.createElement("div");
        gameBoardRow.classList.add("game-board-row");
        for (let j = 0; j < 8; j++) {
            const gameBoardCell = document.createElement("div");
            gameBoardCell.setAttribute("data-cell-index", (i * 8 + j).toString());
            gameBoardCell.classList.add("game-board-cell");
            gameBoardRow.appendChild(gameBoardCell);
        }
        gameBoardContainer.appendChild(gameBoardRow);
    }

    update(); // initial update

    // attach event handlers
    document.querySelectorAll(".game-board-cell").forEach(el => {
        el.addEventListener("click", event => {
            const target = event.target;
            const index = target.getAttribute("data-cell-index");

            if (!game.isValidPlay(parseInt(index))) {
                throw new Error("Invalid move");
            }
            console.log(`Player move: ${index}`);
            game.resolvePlay(parseInt(index));

            // update ui state
            update();

            setTimeout(() => {
                console.log("Computer available plays: ", game.availablePlays);
                const searchRes = game.runSearch(100);
                console.log("Search result:", searchRes);
                const bestPlay = searchRes.bestPlay;
                game.resolvePlay(bestPlay);
                update();
                console.log("Player available plays", game.availablePlays);
            }, 500);
        });
    });
}

initialRender();
