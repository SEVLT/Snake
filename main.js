let theGame //定时器
let status = 'off' //游戏是否开始
let isRunning = 0 //判断游戏是否在运行

addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        startGame()
    }
    if (e.keyCode === 37 && isRunning === 1) {
        if (arrX.length === 1) {
            //为长度为1，此时可改变四个方向
            direction = 'left'
        } else {
            direction = direction === 'right' ? 'right' : 'left' //长度不为1时不可反向
        }
    } else if (e.keyCode === 38 && isRunning === 1) {
        if (arrX.length === 1) {
            direction = 'up'
        } else {
            direction = direction === 'down' ? 'down' : 'up'
        }
    } else if (e.keyCode === 39 && isRunning === 1) {
        if (arrX.length === 1) {
            direction = 'right'
        } else {
            direction = direction === 'left' ? 'left' : 'right'
        }
    } else if (e.keyCode === 40 && isRunning === 1) {
        if (arrX.length === 1) {
            direction = 'down'
        } else {
            direction = direction === 'up' ? 'up' : 'down'
        }
    }
})

function startGame() {
    if (status === 'off') {
        start.style.visibility = 'hidden'
        status = 'on'
        if (isRunning === 0) {
            init()
            isRunning = 1
        }
        if (!foodNode) {
            addFood()
        }
        theGame = setInterval(move, time)
    } else {
        start.style.visibility = 'visible'
        status = 'off'
        clearInterval(theGame)
    }
}
let direction,
    arrX,
    arrY,
    tempX,
    tempY,
    arrFood = [],
    foodNode,
    time
function init() {
    score.children[1].textContent = '0'
    time = diff.children[1].value - 0
    direction = 'right'
    arrX = [0]
    arrY = [240]
    snakeHead.style.top = arrY[0] - 0 + 'px'
    snakeHead.style.left = arrX[0] - 0 + 'px'
    let node = map.children
    for (let i = node.length - 1; i >= 0; i--) {
        if (node[i].className === 'snakeBody') {
            map.removeChild(node[i])
        }
    }
}
function addFood() {
    foodNode = document.createElement('span')
    foodNode.className = 'food'
    let count = 0
    let num
    while (count != 2) {
        //生成两次随机数，分别作为top、left
        num = parseInt(Math.round(Math.random() * 500) / 15) * 15 //15（蛇身）的倍数
        if (num > 480) {
            continue
        }
        if (arrX.indexOf(num) === -1) {
            //若食物块位置非蛇身，则添加
            if (count === 0) {
                foodNode.style.left = num + 'px'
            } else {
                foodNode.style.top = num + 'px'
            }
            arrFood.push(num)
            count++
        }
    }
    map.appendChild(foodNode)
}
function move() {
    let lastBodyX = arrX[arrX.length - 1] //记录数组尾
    let lastBodyY = arrY[arrY.length - 1]
    tempX = arrX[0] //记录数组头
    tempY = arrY[0]
    if (direction === 'up' && arrY[0] - 15 >= 0) {
        snakeHead.style.top = arrY[0] - 15 + 'px'
        arrY[0] -= 15
    } else if (direction === 'down' && arrY[0] + 15 <= 480) {
        snakeHead.style.top = arrY[0] + 15 + 'px'
        arrY[0] += 15
    } else if (direction === 'left' && arrX[0] - 15 >= 0) {
        snakeHead.style.left = arrX[0] - 15 + 'px'
        arrX[0] -= 15
    } else if (direction === 'right' && arrX[0] + 15 <= 480) {
        snakeHead.style.left = arrX[0] + 15 + 'px'
        arrX[0] += 15
    } else {
        gameOver()
        return
    }
    if (arrX[0] === arrFood[0] && arrY[0] === arrFood[1]) {
        //吃到食物块
        score.children[1].textContent = score.children[1].textContent - 0 + 1
        arrFood = [] //清空食物块数组
        let snakeBody = document.createElement('div')
        snakeBody.className = 'snakeBody'
        snakeBody.style.top = lastBodyY + 'px'
        snakeBody.style.left = lastBodyX + 'px'
        map.appendChild(snakeBody)
        arrX.push(lastBodyX)
        arrY.push(lastBodyY)
        map.removeChild(foodNode)
        addFood()
    }
    rebuildSnake() //重构蛇身
    if (!hitMyself()) {
        gameOver()
    }
}
function gameOver() {
    start.style.visibility = 'visible'
    status = 'off'
    isRunning = 0
    clearInterval(theGame)
}
function rebuildSnake() {
    let snake = map.getElementsByTagName('div')
    for (let i = snake.length - 1; i >= 1; i--) {
        if (i === 1) {
            //蛇脖子（蛇头后紧挨着的方块）
            snake[1].style.top = tempY + 'px'
            snake[1].style.left = tempX + 'px'
            arrY[1] = tempY
            arrX[1] = tempX
            break
        }
        //蛇神往前前进一格
        snake[i].style.top = arrY[i - 1] + 'px'
        snake[i].style.left = arrX[i - 1] + 'px'
        //同时蛇身数组也要改变（前进一格）
        arrY[i] = arrY[i - 1]
        arrX[i] = arrX[i - 1]
    }
}
function hitMyself() {
    //判断蛇头是否撞击到身体
    let testX = arrX.slice(1)
    let testY = arrY.slice(1)
    for (let i = 0; i < testX.length; i++) {
        if (testX[i] === arrX[0] && testY[i] === arrY[0]) {
            return false
        }
    }
    return true
}
