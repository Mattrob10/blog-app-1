const express = require('express')
const app = express()
require('dotenv').config()
const morgan = require('morgan')
const mongoose = require('mongoose')
const {expressjwt} = require('express-jwt')
const PORT = process.env.PORT || 8000
const path = require("path")

app.use(express.json())
app.use(morgan('dev'))


mongoose.set('strictQuery', true);
app.use(express.static(path.join(__dirname, "client", "build")))
mongoose.connect(
 process.env.MONGO_URL,
  () => console.log('Connected to the DB')
)

app.use('/auth', require('./routes/authRouter.js'))
// app.use('/api', expressjwt({ secret: process.env.SECRET, algorithms: ['HS256'] })) // req.user
app.use('/api/blog', require('./routes/blogRouter.js'))


app.use((err, req, res, next) => {
  console.log(err)
  if(err.name === "UnauthorizedError "){
    res.status(err.status)
  }
  return res.send({errMsg: err.message})
})
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on local ${PORT}`)
})