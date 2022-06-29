
const express = require('express')
require('./db/mongoose')

const userAPIRouter = require('./routers/user')
const taskAPIRouter = require('./routers/task')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(userAPIRouter)
app.use(taskAPIRouter)


module.exports = app