import ProductController from './controller/ProductController.mjs'
const express = require('express')

const app = express()

app.use(express.json())
app.all('/getJSON', (req, res) => {
  res.json({ data: 'data' })
})

app.get('/product/:id', ProductController.view)


module.exports = app