import express from 'express'
const api = express()

import ProductController from '../app/controller/ProductController.mjs'

api.get('/', (req, res) => {
    res.send('api')
})

api.get('/product', ProductController.index)
api.get('/product/:id', ProductController.view)


export default api