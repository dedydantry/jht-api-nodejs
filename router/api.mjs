import express from 'express'
const api = express()

import ProductController from '../app/controller/ProductController.mjs'
import SearchTrackingController from '../app/controller/SearchTrackingController.mjs'
import ArticleController from '../app/controller/ArticleController.mjs'
import upload from '../app/middleware/upload.mjs'

api.get('/', (req, res) => {
    res.send('api')
})

api.get('/product', ProductController.index)
api.post('/search', ProductController.search)
api.get('/product/:id', ProductController.view)

api.get('/track-search', SearchTrackingController.index)
api.post('/track-search', SearchTrackingController.store)

api.get('/articles',ArticleController.index)
api.post("/article", upload.single("cover"), ArticleController.store);
api.get('/article/:id', ArticleController.show)
api.put('/article/:id', upload.single('cover'), ArticleController.update)
api.delete('/article/:id', ArticleController.destroy)

export default api