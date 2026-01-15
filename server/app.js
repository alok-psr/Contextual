import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

import tree from './routes/tree.route.js'

app.use("/api/tree", tree)

app.get('/', (req, res) => {
  res.json('hello')
})

export { app, PORT }