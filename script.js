const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const score = document.querySelector('.score--value')
const finalScore = document.querySelector('.final-score > span')
const menu = document.querySelector('.menu-screen')
const btnReplay = document.querySelector('.btn-replay')
const audio = new Audio('../assets/audio.mp3')
const size = 30
const initialPosition = {x:270, y:270}
let snake = [
    initialPosition
    // posisoes da cobrinha (corpo)
] // cobrinha do jogo
const incrementScore = () => {
    score.innerText = +score.innerText + 10;
    // paontuação cada vez que se come a fruta
}

const randomNum = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
    // arrendodando e definido o valor maximo
}

// definindo a position com mult de 30
const randomPosition = () => {
    const number = randomNum(0, canvas.width - size)
    return Math.round(number / 30) * 30
}

// multi cores
const randomColor = () => {
    const red = randomNum(0, 255)
    const blue = randomNum(0, 255)
    const green = randomNum(0, 255)

    return `rgba(${red}, ${green}, ${blue})`
}

const food = {
    // frutinhas
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}
let direction, loopId

const drawFood = () => {
    const {x, y, color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

const drawSnake = () => {
    ctx.fillStyle = "#2af16d"
    snake.forEach((position, index) => {
        if(index == snake.length - 1){
            ctx.fillStyle = 'green'
            //cor diferencial da cabeça
        }
        ctx.fillRect(position.x, position.y, size, size)
    })
}

const moveSnake = () => {
    //movendo a cobrinha
    if (!direction) return
    const head = snake[snake.length - 1];
    
    if (direction == 'right') {
        snake.push({x: head.x + size, y: head.y})
    }

    if (direction == 'down') {
        snake.push({x: head.x, y: head.y + size})
    }

    if (direction == 'up') {
        snake.push({x: head.x, y: head.y - size})
    }

    if (direction == 'left') {
        snake.push({x: head.x - size, y: head.y})
    }

    snake.shift()
}

const grid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = 'white'

    for (let i = 30; i < canvas.width; i+=30) {
        ctx.beginPath()
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

// come / n a fruta
const checkEat = () => {
    const head = snake[snake.length - 1]

    if(head.x == food.x && head.y == food.y){
        incrementScore()
        snake.push(head)
        audio.play()

        let x = randomPosition()
        let y = randomPosition()

        while(snake.find((position) => position.x == x && position.y == y)){
            x = randomPosition()
            y = randomPosition()
        }

        // recebe as positions do corpo da cobrinha
        food.x = x
        food.y = y
        food.color = randomColor()
    }
}

const collision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size // 600 - 30
    const neckIndex = snake.length - 2 // pescoço da cobrinha

    const wallColision = (head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit)
    
    // cobra bate nela mesma
    const selfColision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if (wallColision || selfColision) {
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined
    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = 'blur(2px)'
}

const gameLoop = () => {
    clearInterval(loopId)
    ctx.clearRect(0, 0, 600, 600) // limpando o canvas
    grid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    collision()

    loopId = setInterval(() => {
        gameLoop() //função recuusiva
    }, 300) 
}

gameLoop()

// comandos de orientação
document.addEventListener('keydown', ({key}) => {
    // evitando que a cobrinha passe por cima de si mesma
    // &&  direction != 'up'
    if (key == 'ArrowRight' &&  direction != 'left'){
        direction = 'right'
    }
    
    if (key == 'ArrowDown' &&  direction != 'up') {
        direction = 'down'
    }

    if (key == 'ArrowUp' &&  direction != 'down') {
        direction = 'up'
    }

    if (key == 'ArrowLeft' &&  direction != 'right') {
        direction = 'left'
    }
})

btnReplay.addEventListener('click', () => {
    score.innerText = '00'
    menu.style.display = 'none'
    canvas.style.filter = 'none'

    snake = [initialPosition]
})