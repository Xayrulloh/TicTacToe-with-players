const userId = window.localStorage.getItem('userId')
let started = false, myTurn = false, time = 20, icon

if (userId == 1) icon = 'X'
else if (userId == 2) icon = 'O'

setInterval(async() => {
    getUsers()
    started ? '' : isStarted()
    placeBoard()
    checkGame()
    checkTime()
}, 1000);

async function getUsers() {
    const users = await (await fetch('/users')).json()
    
    players.innerHTML = null
    for (let user of users) {
        players.innerHTML += `<li class="players_item">
        <img class="players_item_img" src="../images/${user.profileImg}">
        <h1 id="name">${user.username}</h1>
        </li>`
    }
}

async function isStarted() {
    const startData = await (await fetch('/started')).json()
    started = startData
}

async function placeBoard() {
    if (started) {
        const users = await (await fetch('/users')).json()
        let mainBoard = await (await fetch('/board')).json()
        
        const me = users.find(user => user?.userId == userId)
        const friend = users.find(user => user?.userId != userId)

        if (icon && me.score === 3) {
            alert('You are winner')
            const ended = await fetch('/ended')
            
            window.location = '/'
        } else if (icon && friend.score === 3) {
            alert('You are loser')
            const ended = await fetch('/ended')
            
            window.location = '/'
        } else if (users[0].score === 3 || users[1].score === 3) {
            alert('Game ended')
            window.location = '/'
        }
        
        if (icon) {
            if (me.turn) {
                myTurn = true
                
                board.innerHTML = `<h1 class="game--title">Turn: Your turn</h1>
                <h1 class="game--score">Score: ${me.username} = ${me.score} ${friend.username} = ${friend.score}</h1>
                <div class="game--container" id="cells"></div>
                <h1 class="game--time" id="boardTime">Time: ${time}</h1>`
                
                for (let i = 0; i < mainBoard.length; i++) {
                    cells.innerHTML += `<div data-cell-index="${i}" id="cell">${mainBoard[i]}</div>`
                }
                
                for (let el of cell) {
                    el.onclick = async() => {
                        clickedIndex = el.getAttribute('data-cell-index')
                        
                        if (!mainBoard[clickedIndex]) {
                            time = 20
                            
                            mainBoard[clickedIndex] = icon
                            
                            try {
                                const test = await fetch('/clicked', {
                                    method:'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        "mainBoard": mainBoard
                                    })
                                })
                                
                            } catch (error) {
                                console.log(error.message);
                            }
                            
                        } else {
                            alert('Is some trouble with your head?')
                        }
                    }
                }
                
            } else if (!me.turn) {
                myTurn = false
                
                board.innerHTML = `<h1 class="game--title">Turn: ${friend.username}</h1>
                <h1 class="game--score">Score: ${me.username} = ${me.score} ${friend.username} = ${friend.score}</h1>
                <div class="game--container" id="cells"></div>`
                
                for (let el of mainBoard) {
                    cells.innerHTML += `<div data-cell-index="0" id="cell">${el}</div>`
                }
            }
        } else {
            board.innerHTML = `<h1 class="game--title">Turn: ${users[0].turn ? users[0].username : users[1].username}</h1>
            <h1 class="game--score">Score: ${users[0].username} = ${users[0].score} ${users[1].username} = ${users[1].score}</h1>
            <div class="game--container" id="cells"></div>`
            
            for (let el of mainBoard) {
                cells.innerHTML += `<div data-cell-index="0" id="cell">${el}</div>`
            }
        }
    }
}

async function checkGame() {
    if (started) {
        const mainBoard = await (await fetch('/board')).json()
        const users = await (await fetch('/users')).json()

        
        if ((mainBoard[0] == 'X' && mainBoard[1] == 'X' && mainBoard[2] == 'X') || (mainBoard[3] == 'X' && mainBoard[4] == 'X' && mainBoard[5] == 'X') || (mainBoard[6] == 'X' && mainBoard[7] == 'X' && mainBoard[8] == 'X') || (mainBoard[0] == 'X' && mainBoard[3] == 'X' && mainBoard[6] == 'X') || (mainBoard[1] == 'X' && mainBoard[4] == 'X' && mainBoard[7] == 'X') || (mainBoard[2] == 'X' && mainBoard[5] == 'X' && mainBoard[8] == 'X') || (mainBoard[0] == 'X' && mainBoard[4] == 'X' && mainBoard[8] == 'X') || (mainBoard[2] == 'X' && mainBoard[4] == 'X' && mainBoard[6] == 'X')) {
            if (icon === 'X') {
                alert('You win')
                
                try {
                    const test = await fetch('/status', {
                        method:'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "draw": false
                        })
                    })
                    
                } catch (error) {
                    console.log(error.message);
                }
            } 
            else if (icon === 'O') alert('you lose')
            else if (!icon) alert(`${users[0].username} win`)

            
        } else if ((mainBoard[0] == 'O' && mainBoard[1] == 'O' && mainBoard[2] == 'O') || (mainBoard[3] == 'O' && mainBoard[4] == 'O' && mainBoard[5] == 'O') || (mainBoard[6] == 'O' && mainBoard[7] == 'O' && mainBoard[8] == 'O') || (mainBoard[0] == 'O' && mainBoard[3] == 'O' && mainBoard[6] == 'O') || (mainBoard[1] == 'O' && mainBoard[4] == 'O' && mainBoard[7] == 'O') || (mainBoard[2] == 'O' && mainBoard[5] == 'O' && mainBoard[8] == 'O') || (mainBoard[0] == 'O' && mainBoard[4] == 'O' && mainBoard[8] == 'O') || (mainBoard[2] == 'O' && mainBoard[4] == 'O' && mainBoard[6] == 'O')) {
            if (icon === 'O') {
                alert('You win')
                
                try {
                    const test = await fetch('/status', {
                        method:'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "draw": false
                        })
                    })
                    
                } catch (error) {
                    console.log(error.message);
                }
            }
            else if (icon === 'X') alert('you lose')
            else if (!icon) alert(`${users[1].username} win`)
            
        } else {
            let check = mainBoard.filter(el => el)
            
            if (check.length === 9) {
                alert('Draw')
                
                try {
                    const test = await fetch('/status', {
                        method:'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "draw": true
                        })
                    })
                    
                } catch (error) {
                    console.log(error.message);
                }
            }
        }
        
    }
    
    
}

async function checkTime() {
    if (myTurn) {
        boardTime.textContent = 'Time: ' + --time
        
        if (time == '0') {
            time = 20
            
            try {
                let test = await fetch('/timeEnded', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        "status": 200
                    })
                })
            } catch (error) {
                console.log(error.message);
            }
        }
    }
}
