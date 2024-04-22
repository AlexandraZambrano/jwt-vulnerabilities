import express from 'express'
import jwt from 'jsonwebtoken'

const secret = 'secret123'
const app = express()

app.use(express.json())


app.post('/login', (req, res) => {
    
    const { username, password } = req.body

    if(username === "user" && password === "user") {
        return res.json({
            token: jwt.sign({ userid: "user" }, secret)
        })
    }

    if( username === "admin" && password === "admin"){
        return res.json({
            token: jwt.sign({ userid: "admin" }, secret)
        })
    }

    return res.status(401).json({ message: "The username and the password you provided are invalid" })
})

app.post('/jwt', (req, res) => {
    const token = req.body.token

    const decodedHeader = jwt.decode(token, { complete: true }).header

    let key

    if(decodedHeader.alg === 'none') {
        key = null
    } else {
        key = secret
    }

    try {
        const decoded = jwt.verify(token, key, { algorithms: ['HS256', 'none'] })

        res.json({ result: 'valid token', message: `Hello, ${decoded.userid}` })
    } catch (error) {
        res.status(400).json(error)
    }
})

app.get('/dashboard', (req, res) => {
    const token =  req.headers.authorization.split(' ')[1]

    if(!token) return res.status(401).json('Unauthorized')

    try {
        const decoded = jwt.verify(token, secret)
        req.user = decoded

        res.status(200).json({ message: "You are in!" })
    } catch (error) {
        res.status(400).json(error)
    }

})

app.listen(7000)
console.log(`port is running`)