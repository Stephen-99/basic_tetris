document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  let timerID
  let score = 0
  const colours = ['aqua', 'blue', 'green', 'red', 'orange', 'yellow']

  const width = 10
  const height = 200

  // The tetrominos
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2]]
  const rTetromino = [
    [0, 1, width + 1, width * 2 + 1],
    [width * 2, width * 2 + 1, width * 2 + 2, width + 2],
    [0, width, width * 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2]]
  const zTetromino = [
    [width * 2, width * 2 + 1, width + 1, width + 2],
    [0, width, width + 1, width * 2 + 1],
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [1, width + 1, width, width * 2]
  ]
  const tTetromino = [
    [width, 1, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1]
  ]
  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
  ]
  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
  ]

  const theTetrominos = [lTetromino, rTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

  let currentPosition = 3
  let currentRotation = 0

  // randomly select a tetromino and its first rotation
  let random = Math.floor(Math.random() * theTetrominos.length)
  let nextRandom = Math.floor(Math.random() * theTetrominos.length)
  let current = theTetrominos[random][currentRotation]

  // draw the tetromino
  function draw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundColor = colours[random]
    })
  }

  // undraw the tetromino
  function undraw () {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }

  // assign functions to keycodes
  function control (e) {
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }
  document.addEventListener('keyup', control)
  // Function to move the tetromino down
  function moveDown () {
    freeze()
    undraw()
    currentPosition += width
    draw()
    // Uncommenting this stops movement as soon as current tetromino touches a tetromino
    // freeze()
  }

  function freeze () {
    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominos.length)
      currentPosition = 3
      currentRotation = 0
      current = theTetrominos[random][currentRotation]
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  // move the tetromino left unless it is at the endge or there is a blockage
  function moveLeft () {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % 10 === 0)

    if (!isAtLeftEdge) {
      currentPosition -= 1
    }

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1
    }

    draw()
  }

  // move the tetromino right unless it is at the endge or there is a blockage
  function moveRight () {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % (width) === width - 1)

    if (!isAtRightEdge) {
      currentPosition += 1
    }

    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1
    }

    draw()
  }

  // rotate the tetromiono
  function rotate () {
    undraw()
    currentRotation++
    if (currentRotation === current.length) {
      currentRotation = 0
    }

    current = theTetrominos[random][currentRotation]

    if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      currentRotation--
      if (currentRotation === -1) {
        currentRotation = current.length
      }
    }
    current = theTetrominos[random][currentRotation]
    /*
    const isPastLeftEdge = current.some(index => (currentPosition + index) % 10 === 0)
    const isPastRightEdge = current.some(index => (currentPosition + index) % (width) === width - 1)

    if (isPastLeftEdge || isPastRightEdge) {
      currentRotation--
      if (currentRotation === -1) {
        currentRotation = current.length
      }
    }
    current = theTetrominos[random][currentRotation] */
    draw()
  }

  // show up-next tetromino in mini-grid
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0

  const upNextTetrominos = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], // lTetromino
    [0, 1, displayWidth + 1, displayWidth * 2 + 1], // rTetromino
    [displayWidth * 2, displayWidth * 2 + 1, displayWidth + 1, displayWidth + 2], // zTetromino
    [displayWidth, 1, displayWidth + 1, displayWidth + 2], // tTetromino
    [0, 1, displayWidth, displayWidth + 1], // oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] // iTetromino
  ]

  // display the shape in the mini-grid display
  function displayShape () {
    // remove any trace of a tetromino from the mini-grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetrominos[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colours[nextRandom]
    })
  }

  // add functionality to the button
  startBtn.addEventListener('click', () => {
    // if timer had been set, game is running, pause the game
    if (timerID) {
      clearInterval(timerID)
      timerID = null
    } else {
      draw()
      timerID = setInterval(moveDown, 1000)
      // nextRandom = Math.floor(Math.random() * theTetrominos.length)
      displayShape()
    }
  })

  // add score
  function addScore () {
    for (let ii = 0; ii < (height - 1); ii += width) {
      const row = [ii, ii + 1, ii + 2, ii + 3, ii + 4, ii + 5, ii + 6, ii + 7, ii + 8, ii + 9]

      if (row.every(index => squares[index].classList.contains('taken'))) {
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(ii, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  // game over
  function gameOver () {
    // If the position where the tetromino is being adde3d is taken, the game is over
    if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      scoreDisplay.innerHTML = 'end'
      clearInterval(timerID)
    }
  }
})
