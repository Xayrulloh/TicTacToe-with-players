const express = require('express'), app = express(), path =  require('path'), PORT = process.env.PORT ?? 5000, multer = require('multer')
let started = false, users = [], board = ["","","","","","","","",""]

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname )
    }
})

const upload = multer({ storage: storage })

app.use(express.static(path.join(__dirname, 'public')))
app.use( express.json() )
app.use( express.urlencoded({extended: true}))

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'login.html')))
app.get('/404', (req, res) => res.sendFile(path.join(__dirname, 'public', 'html', '404.html')))
app.get('/game', (req, res) => res.sendFile(path.join(__dirname, 'public', 'html', 'game.html')))
app.get('/users', (req, res) => res.send(users))
app.get('/started', (req, res) => res.send(started))
app.get('/board', (req, res) => res.send(board))
app.get('/ended', (req, res) => { started = false; users = []; board = ["","","","","","","","",""]; res.end()})

app.post('/enter', upload.single('image'), 
    (req, res) => {
        const {username} = req.body, image = req.file.originalname
        
        if (started === false) {
            users.push({"username": username, "userId":users.length ? users.at(-1).userId + 1 : 1,"profileImg":image,"turn":users.length ? false : true, "score":0})
            
            if (users.length == 2) started = true
            
            res.status(200).json({userId: users.at(-1).userId, site: '/game'})

        } else {
            users.push({"username": username, "userId":users.length ? users.at(-1).userId + 1 : 1,"profileImg":image})
            
            res.status(200).json({userId: users.at(-1).userId, site: '/game'})
        }
    }
)

app.post('/timeEnded', (req, res) => {
    if (users[0].turn) {
        users[1].score += 1
        users[1].turn = true
        users[0].turn = false
    } else {
        users[0].score += 1
        users[0].turn = true
        users[1].turn = false
    }

    board = ["","","","","","","","",""]
    res.status(200).end()
})

app.post('/clicked', (req, res) => {
    board = req.body.mainBoard

    if (users[0].turn) {
        users[0].turn = false
        users[1].turn = true
    } else {
        users[1].turn = false
        users[0].turn = true
    }

    res.end()
})

app.post('/status', (req, res) => {
    let {draw} = req.body
    board = ["","","","","","","","",""]

    if (!draw) {
        !users[0].turn ? ++users[0].score : ++users[1].score
    } 

    res.end('OK')
})

app.listen(PORT, console.log('http://192.168.42.212:5000'))