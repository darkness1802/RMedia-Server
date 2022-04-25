import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { API } from './routes/api.js'
import { Auth } from './routes/auth.js'
const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.status(200).json("Hello world!")
})

app.use("/api", API)
app.use("/auth", Auth)
app.listen(8888, () => {
    console.log("Server listening on port 8888")
})