const express = require('express')
const app = express()
const port = process.env.PORT || 8080
const jwt = require('jsonwebtoken')
const cors = require('cors')

app.use(express.json())
app.use(cors())

const jsonSecretKey = 'secret';

app.use((req, res, next) => {

  if(req.url === '/signup' || req.url === '/login') next()
  else {
 
    const token = getToken(req)

    console.log(typeof token)

    if(token) {
      console.log(token)

      if(jwt.verify(token, jsonSecretKey)) {

        req.decode = jwt.decode(token)
        next()
      } else {
        res.status(403).json({ error: 'Not Authorized.' })
      }
    } else {
      res.status(403).json({ error: 'No token. Unauthorized.' })
    }
  }
})

function getToken(req) {
  return req.headers.authorization.split(' ')[1]
}

const users = {}

app.post('/signup', (req, res) => {
  const { username, name, password } = req.body
  users[username] = {
    name,
    password                
  }
  res.json({ success: 'true' })
})

app.post('/login', (req, res) => {
  const { username, password } = req.body
  const user = users[username]
  if(user && user.password === password) {
    res.json({ token: jwt.sign({ name: user.name}, jsonSecretKey)})
  } else {
    res.json({
      token: '', 
      error: { message: 'Error logging in. Invalid username/password combination.'}
    })
  }
})

app.get('/profile', (req, res) => {
  res.json(req.decode)
})

app.listen(port, () => {
  console.log(`Listening on ${port}`)
})