import express from 'express'
const api = express()
import multer from 'multer'
const upload = multer({ dest: './public/uploads/' })

import ProductController from '../app/controller/ProductController.mjs'
import SearchTrackingController from '../app/controller/SearchTrackingController.mjs'

api.get('/', (req, res) => {
    res.send('api')
})

api.get('/product', ProductController.index)
api.post('/search', ProductController.search)
api.get('/product/:id', ProductController.view)
api.post('/search-picture', upload.single('picture'), ProductController.searchByPicture)

api.get('/track-search', SearchTrackingController.index)
api.post('/track-search', SearchTrackingController.store)


export default api