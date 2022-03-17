import express from 'express'
const api = express()

import ProductController from '../app/controller/ProductController.mjs'
import SearchTrackingController from '../app/controller/SearchTrackingController.mjs'

api.get('/', (req, res) => {
    res.send('api')
})

api.get('/product', ProductController.index)
api.get('/product/:id', ProductController.view)

api.get('/track-search', SearchTrackingController.index)
api.post('/track-search', SearchTrackingController.store)


export default api