import express from 'express'
const api = express()

import ProductController from '../app/controller/ProductController.mjs'
import SearchTrackingController from '../app/controller/SearchTrackingController.mjs'
import ArticleController from '../app/controller/ArticleController.mjs'
import EventController from '../app/controller/EventController.mjs'
import ParticipantController from '../app/controller/ParticipantController.mjs'
import ProductRecommendController from '../app/controller/ProductRecommendController.mjs'

api.get('/', (req, res) => {
    res.send('api')
})

api.get('/product', ProductController.index)
api.post('/search', ProductController.search)
api.get('/product/:id', ProductController.view)

api.get('/track-search', SearchTrackingController.index)
api.post('/track-search', SearchTrackingController.store)

api.get('/articles',ArticleController.index)
api.post('/article', ArticleController.store);
api.get('/article/:id', ArticleController.show)
api.put('/article/:id', ArticleController.update)
api.delete('/article/:id', ArticleController.destroy)

api.get('/events', EventController.index)
api.post('/events', EventController.store)
api.get('/events/:slug', EventController.show)
api.put('/events/:id', EventController.update)
api.delete('/events/:id', EventController.destroy)

api.post('/participants', ParticipantController.store)

api.get('/product-recommend', ProductRecommendController.index)
api.post('/product-recommend', ProductRecommendController.store)
api.get('/product-recommend/:id', ProductRecommendController.show)
api.put('/product-recommend/:id', ProductRecommendController.update)
api.delete('/product-recommend/:id', ProductRecommendController.destroy)

export default api