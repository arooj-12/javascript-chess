const gameBoard = document.querySelector("#gameboard")
const playerDisplay = document.querySelector("#player")
const infoDisplay = document.querySelector("#info-display")
const width = 8
let playerGo = ['black', 'white'];
playerDisplay.textContent = 'black'

const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook,
]

function createBoard() {
    startPieces.forEach((startPiece, i) => {
        const square = document.createElement('div')
        square.classList.add('square')
        square.innerHTML = startPiece
        square.firstChild?.setAttribute('draggable', true)
        square.setAttribute('square-id', i)
        //square.classList.add('beige')
        const row = Math.floor( (63 - i) /8 ) + 1
        if ( row % 2 === 0) {
            square.classList.add(i % 2 === 0 ? "beige" : "brown")
        } else {
            square.classList.add(i % 2 === 0 ? "brown" : "beige")
        }

        if ( i <= 15) {
            square.firstChild.firstChild.classList.add('black')
        }

        if ( i >= 48) {
            square.firstChild.firstChild.classList.add('white')
        }
        gameBoard.append(square)
    })
}
createBoard()

const allSquares = document.querySelectorAll("#gameboard .square")

allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)
})

let startPositionId
let draggedElement

function dragStart (e) {
    startPositionId = e.target.parentNode.getAttribute('square-id')
    draggedElement = e.target.parentNode;

    playerGo = draggedElement.classList.contains('white') ? 'white' : 'black';
}

function dragOver(e) {
    e.preventDefault()
}

function dragDrop(e) {
    e.stopPropagation();
    console.log('e.target', e.target);
    if (!draggedElement) {
        return;
    }
    console.log('draggedElement classList:', draggedElement.classList);
    console.log('playerGo:', playerGo);
    console.log('correctGo check:', draggedElement.classList.contains(playerGo));


    const correctGo = draggedElement.classList.contains(playerGo);
    const taken = e.target.classList.contains('piece');
    const valid = checkIfValid(e.target);
    const opponentGo = playerGo === 'white' ? 'black' : 'white';
    const takenByOpponent = e.target.firstChild?.classList.contains(opponentGo);

    if (correctGo) {
        if (takenByOpponent && valid) {
            e.target.parentNode.append(draggedElement);
            e.target.remove();
            checkForWin();
            changePlayer();
            return;
        }

        if (taken) {
            infoDisplay.textContent = "You cannot go here!";
            setTimeout(() => infoDisplay.textContent = "", 2000);
            return;
        }

        if (valid) {
            e.target.appendChild(draggedElement);
            checkForWin();
            changePlayer();
            return;
        }
        if (taken) {
            infoDisplay.textContent = "you cannot go here!"
            setTimeout(() =>infoDisplay.textContent = "", 2000)
            return
        }
        if (valid) {
           e.target.append(draggedElement)
           checkForWin()
           changePlayer()
           return
        }
    }

}

document.addEventListener("DOMContentLoaded", () => {
    const pieces = document.querySelectorAll(".piece");

    pieces.forEach(piece => {
        piece.addEventListener("dragstart", handleDragStart);
    });

    const squares = document.querySelectorAll(".square");

    squares.forEach(square => {
        square.addEventListener("dragover", handleDragOver);
        square.addEventListener("drop", handleDrop);
    });
});

function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.id);
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    const draggedPiece = document.getElementById(data);
    const targetSquare = e.target;

    if (targetSquare.classList.contains("square") && draggedPiece) {
        // Update square-id attribute of the dragged piece
        const targetId = targetSquare.getAttribute("square-id");
        draggedPiece.setAttribute("square-id", targetId);

        // Remove startId data
        e.dataTransfer.clearData("text/startId");

        // Append the dragged piece to the target square
        targetSquare.appendChild(draggedPiece);
    }
}






// function checkIfValid(target) {
//     if (!target || !target.id) {
//         return false; 
//     }
//     const targetId = Number(target.getAttribute('square-id')) || Number(target.parentNode.getAttribute('square-id'))
//     const startId = Number(startPositionId)
//     const piece = draggedElement.id
//     console.log('targetId', targetId)
//     console.log('startId', startId)
//     console.log('piece', piece)
function checkIfValid(target) {
    // Check if target or target.firstChild is undefined or null
    if (!target || !target.firstChild) {
        return false;
    }

    const targetId = target.firstChild.id;
    const startId = draggedElement.firstChild.id;
    const piece = draggedElement.firstChild.classList[1];

    switch(piece) {
        case 'pawn' :
            const starterRow = [8,9,10,11,12,13,14,15]
            if (
                starterRow.includes(startId) && startId + width * 2 === targetId ||
                startId + width === targetId ||
                startId + width - 1 === targetId && document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild ||
                startId + width + 1 === targetId && document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild
                ) {
                    return true
                }
                break;
                case 'knight':
                    if (
                        startId + width * 2 + 1 === targetId ||
                        startId + width * 2 - 1 === targetId ||
                        startId + width - 2 === targetId ||
                        startId + width + 2 === targetId ||
                        startId + width * 2 + 1 === targetId ||
                        startId - width * 2 - 1 === targetId ||
                        startId - width - 2 === targetId ||
                        startId - width + 2 === targetId
                    ) {
                        return true
                    }
                    break;
                    case 'bishop':
                        if (
                            startId + width + 1 === targetId ||
                            startId + width * 2 + 2 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild ||
                            startId + width * 3 + 3 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild ||
                            startId + width * 4 + 4 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild || !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild ||
                            startId + width * 5 + 5 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild || !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild ||
                            startId + width * 6 + 6 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild || !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild & !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`).firstChild ||
                            startId + width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild || !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild & !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`).firstChild & !document.querySelector(`[square-id="${startId + width * 6 + 6}"]`).firstChild||
                            //--
                            startId - width - 1 === targetId ||
                            startId - width * 2 - 2 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild ||
                            startId - width * 3 - 3 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild ||
                            startId - width * 4 - 4 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild || !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild ||
                            startId - width * 5 - 5 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild || !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild ||
                            startId - width * 6 - 6 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild || !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild & !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`).firstChild ||
                            startId - width * 7 - 7 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild || !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild & !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`).firstChild & !document.querySelector(`[square-id="${startId + width * 6 - 6}"]`).firstChild||
                            //--
                            startId - width + 1 === targetId ||
                            startId - width * 2 + 2 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild ||
                            startId - width * 3 + 3 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild ||
                            startId - width * 4 + 4 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild || !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild ||
                            startId - width * 5 + 5 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild || !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild ||
                            startId - width * 6 + 6 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild || !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild & !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`).firstChild ||
                            startId - width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild || !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild & !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`).firstChild & !document.querySelector(`[square-id="${startId + width * 6 + 6}"]`).firstChild||
                            //--
                            startId + width - 1 === targetId ||
                            startId + width * 2 - 2 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild ||
                            startId + width * 3 - 3 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild ||
                            startId + width * 4 - 4 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild || !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild ||
                            startId + width * 5 - 5 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild || !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild ||
                            startId + width * 6 - 6 === targetId&& !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild || !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild & !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`).firstChild ||
                            startId + width * 7 - 7 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild || !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild & !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`).firstChild & !document.querySelector(`[square-id="${startId + width * 6 - 6}"]`).firstChild
                       ) {
                        return true
                       }
                       break;
                        case 'rook':
                            if (
                                startId + width === targetId ||
                                startId + width * 2 === targetId && !document.querySelector(`[square-ids="${startId + width}"]`).firstChild ||
                                startId + width * 3 === targetId && !document.querySelector(`[square-ids="${startId + width}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 2}"]`).firstChild ||
                                startId + width * 4 === targetId && !document.querySelector(`[square-ids="${startId + width}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 3}"]`).firstChild||
                                startId + width * 5 === targetId && !document.querySelector(`[square-ids="${startId + width}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 4}"]`).firstChild||
                                startId + width * 6 === targetId && !document.querySelector(`[square-ids="${startId + width}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 4}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 5}"]`).firstChild||
                                startId + width * 7 === targetId && !document.querySelector(`[square-ids="${startId + width}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 4}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 5}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 6}"]`).firstChild||
                                //--
                                startId - width === targetId ||
                                startId - width * 2 === targetId && !document.querySelector(`[square-ids="${startId - width}"]`).firstChild ||
                                startId - width * 3 === targetId && !document.querySelector(`[square-ids="${startId - width}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 2}"]`).firstChild ||
                                startId - width * 4 === targetId && !document.querySelector(`[square-ids="${startId - width}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 3}"]`).firstChild||
                                startId - width * 5 === targetId && !document.querySelector(`[square-ids="${startId - width}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 4}"]`).firstChild||
                                startId - width * 6 === targetId && !document.querySelector(`[square-ids="${startId - width}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 4}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 5}"]`).firstChild||
                                startId - width * 7 === targetId && !document.querySelector(`[square-ids="${startId - width}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 4}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 5}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 6}"]`).firstChild||
                                //--
                                startId + 1 === targetId ||
                                startId + 2 === targetId && !document.querySelector(`[square-ids="${startId + 1}"]`).firstChild ||
                                startId + 3 === targetId && !document.querySelector(`[square-ids="${startId + 1}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 2}"]`).firstChild ||
                                startId + 4 === targetId && !document.querySelector(`[square-ids="${startId + 1}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 3}"]`).firstChild||
                                startId + 5 === targetId && !document.querySelector(`[square-ids="${startId + 1}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 3}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 4}"]`).firstChild||
                                startId + 6 === targetId && !document.querySelector(`[square-ids="${startId + 1}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 3}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 4}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 5}"]`).firstChild||
                                startId + 7 === targetId && !document.querySelector(`[square-ids="${startId + 1}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 3}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 4}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 5}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 6}"]`).firstChild||
                                //--
                                startId - 1 === targetId ||
                                startId - 2 === targetId && !document.querySelector(`[square-ids="${startId - 1}"]`).firstChild ||
                                startId - 3 === targetId && !document.querySelector(`[square-ids="${startId - 1}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 2}"]`).firstChild ||
                                startId - 4 === targetId && !document.querySelector(`[square-ids="${startId - 1}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 3}"]`).firstChild||
                                startId - 5 === targetId && !document.querySelector(`[square-ids="${startId - 1}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 3}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 4}"]`).firstChild||
                                startId - 6 === targetId && !document.querySelector(`[square-ids="${startId - 1}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 3}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 4}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 5}"]`).firstChild||
                                startId - 7 === targetId && !document.querySelector(`[square-ids="${startId - 1}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 3}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 4}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 5}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 6}"]`).firstChild
                            ) {
                                return true
                            }
                            break;
                            case 'queen':
                                if (
                                    startId + width + 1 === targetId ||
                            startId + width * 2 + 2 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild ||
                            startId + width * 3 + 3 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild ||
                            startId + width * 4 + 4 === targetId&& !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild || !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild ||
                            startId + width * 5 + 5 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild || !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild ||
                            startId + width * 6 + 6 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild || !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild & !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`).firstChild ||
                            startId + width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId + width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 + 2}"]`).firstChild || !document.querySelector(`[square-id="${startId + width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 + 4}"]`).firstChild & !document.querySelector(`[square-id="${startId + width * 5 + 5}"]`).firstChild & !document.querySelector(`[square-id="${startId + width * 6 + 6}"]`).firstChild||
                            //--
                            startId - width - 1 === targetId ||
                            startId - width * 2 - 2 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild ||
                            startId - width * 3 - 3 === targetId&& !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild ||
                            startId - width * 4 - 4 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild || !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild ||
                            startId - width * 5 - 5 === targetId&& !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild || !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild ||
                            startId - width * 6 - 6 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild || !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild & !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`).firstChild ||
                            startId - width * 7 - 7 === targetId && !document.querySelector(`[square-id="${startId - width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 - 2}"]`).firstChild || !document.querySelector(`[square-id="${startId - width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 - 4}"]`).firstChild & !document.querySelector(`[square-id="${startId - width * 5 - 5}"]`).firstChild & !document.querySelector(`[square-id="${startId + width * 6 - 6}"]`).firstChild||
                            //--
                            startId - width + 1 === targetId ||
                            startId - width * 2 + 2 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild ||
                            startId - width * 3 + 3 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild ||
                            startId - width * 4 + 4 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild || !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild ||
                            startId - width * 5 + 5 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild || !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild ||
                            startId - width * 6 + 6 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild || !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild & !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`).firstChild ||
                            startId - width * 7 + 7 === targetId && !document.querySelector(`[square-id="${startId - width + 1}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 2 + 2}"]`).firstChild || !document.querySelector(`[square-id="${startId - width * 3 + 3}"]`).firstChild && !document.querySelector(`[square-id="${startId - width * 4 + 4}"]`).firstChild & !document.querySelector(`[square-id="${startId - width * 5 + 5}"]`).firstChild & !document.querySelector(`[square-id="${startId + width * 6 + 6}"]`).firstChild||
                            //--
                            startId + width - 1 === targetId ||
                            startId + width * 2 - 2 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild ||
                            startId + width * 3 - 3 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild ||
                            startId + width * 4 - 4 === targetId&& !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild || !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild ||
                            startId + width * 5 - 5 === targetId&& !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild || !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild ||
                            startId + width * 6 - 6 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild || !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild & !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`).firstChild ||
                            startId + width * 7 - 7 === targetId && !document.querySelector(`[square-id="${startId + width - 1}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 2 - 2}"]`).firstChild || !document.querySelector(`[square-id="${startId + width * 3 - 3}"]`).firstChild && !document.querySelector(`[square-id="${startId + width * 4 - 4}"]`).firstChild & !document.querySelector(`[square-id="${startId + width * 5 - 5}"]`).firstChild & !document.querySelector(`[square-id="${startId + width * 6 - 6}"]`).firstChild);
                            //--
                            if (
                                startId + width === targetId ||
                                startId + width * 2 === targetId && !document.querySelector(`[square-ids="${startId + width}"]`).firstChild ||
                                startId + width * 3 === targetId && !document.querySelector(`[square-ids="${startId + width}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 2}"]`).firstChild ||
                                startId + width * 4 === targetId && !document.querySelector(`[square-ids="${startId + width}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 3}"]`).firstChild||
                                startId + width * 5 === targetId && !document.querySelector(`[square-ids="${startId + width}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 4}"]`).firstChild||
                                startId + width * 6 === targetId && !document.querySelector(`[square-ids="${startId + width}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 4}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 5}"]`).firstChild||
                                startId + width * 7 === targetId && !document.querySelector(`[square-ids="${startId + width}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 3}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 4}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 5}"]`).firstChild && !document.querySelector(`[square-ids="${startId + width * 6}"]`).firstChild||
                                //--
                                startId - width === targetId ||
                                startId - width * 2 === targetId && !document.querySelector(`[square-ids="${startId - width}"]`).firstChild ||
                                startId - width * 3 === targetId && !document.querySelector(`[square-ids="${startId - width}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 2}"]`).firstChild ||
                                startId - width * 4 === targetId && !document.querySelector(`[square-ids="${startId - width}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 3}"]`).firstChild||
                                startId - width * 5 === targetId && !document.querySelector(`[square-ids="${startId - width}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 4}"]`).firstChild||
                                startId - width * 6 === targetId && !document.querySelector(`[square-ids="${startId - width}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 4}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 5}"]`).firstChild||
                                startId - width * 7 === targetId && !document.querySelector(`[square-ids="${startId - width}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 3}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 4}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 5}"]`).firstChild && !document.querySelector(`[square-ids="${startId - width * 6}"]`).firstChild||
                                //--
                                startId + 1 === targetId ||
                                startId + 2 === targetId && !document.querySelector(`[square-ids="${startId + 1}"]`).firstChild ||
                                startId + 3 === targetId && !document.querySelector(`[square-ids="${startId + 1}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 2}"]`).firstChild ||
                                startId + 4 === targetId && !document.querySelector(`[square-ids="${startId + 1}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 3}"]`).firstChild||
                                startId + 5 === targetId && !document.querySelector(`[square-ids="${startId + 1}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 3}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 4}"]`).firstChild||
                                startId + 6 === targetId && !document.querySelector(`[square-ids="${startId + 1}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 3}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 4}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 5}"]`).firstChild||
                                startId + 7 === targetId && !document.querySelector(`[square-ids="${startId + 1}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 3}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 4}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 5}"]`).firstChild && !document.querySelector(`[square-ids="${startId + 6}"]`).firstChild||
                                //--
                                startId - 1 === targetId ||
                                startId - 2 === targetId && !document.querySelector(`[square-ids="${startId - 1}"]`).firstChild ||
                                startId - 3 === targetId && !document.querySelector(`[square-ids="${startId - 1}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 2}"]`).firstChild ||
                                startId - 4 === targetId && !document.querySelector(`[square-ids="${startId - 1}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 3}"]`).firstChild||
                                startId - 5 === targetId && !document.querySelector(`[square-ids="${startId - 1}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 3}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 4}"]`).firstChild||
                                startId - 6 === targetId && !document.querySelector(`[square-ids="${startId - 1}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 3}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 4}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 5}"]`).firstChild||
                                startId - 7 === targetId && !document.querySelector(`[square-ids="${startId - 1}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 2}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 3}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 4}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 5}"]`).firstChild && !document.querySelector(`[square-ids="${startId - 6}"]`).firstChild  
                                ) {
                                    return true
                                }
                                break;
                                case 'king':
                                    if (
                                        startId + 1 === targetId ||
                                        startId - 1 === targetId ||
                                        startId + width === targetId ||
                                        startId - width === targetId ||
                                        startId + width - 1 === targetId ||
                                        startId + width + 1 === targetId ||
                                        startId - width - 1 === targetId ||
                                        startId - width + 1 === targetId
                                    ) {
                                        return true
                                    }
                                    
                }
}

function changePlayer() {
    if (playerGo === "black") {
        reverseIds()
        playerGo = "white"
        playerDisplay.textContent = 'white'
    } else {
        reverseIds()
        playerGo = "black"
        playerDisplay.textContent = 'black'
    }
}

function reverseIds() {
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => 
          square.setAttribute('square-id', (width * width -1) - i))
}

function revertIds() {
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => square.setAttribute('square-id', i))
}

function checkForWin() {
    const kings = Array.from(document.querySelectorAll('#king'))
    console.log(kings)
    if (!kings.some(king => king.firstChild.classList.contains('white'))) {
        infoDisplay.innerHTML = "Black player wins!"
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))
    }
    if (!kings.some(king => king.firstChild.classList.contains('black'))) {
        infoDisplay.innerHTML = "White player wins!"
        const allSquares = document.querySelectorAll('.square')
        allSquares.forEach(square => square.firstChild?.setAttribute('draggable', false))
    }
}

