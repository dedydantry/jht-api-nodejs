import express from 'express'
const api = express()

import ProductController from '../app/controller/ProductController.mjs'
import SearchTrackingController from '../app/controller/SearchTrackingController.mjs'
import ArticleController from '../app/controller/ArticleController.mjs'
import EventController from '../app/controller/EventController.mjs'
import EventOrderController from '../app/controller/EventOrderController.mjs'
import ParticipantController from '../app/controller/ParticipantController.mjs'
import ProductRecommendController from '../app/controller/ProductRecommendController.mjs'
import Order1688NoteController from '../app/controller/Order1688NoteController.mjs'

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
api.get('/article/detail/:slug', ArticleController.detail)
api.put('/article/:id', ArticleController.update)
api.delete('/article/:id', ArticleController.destroy)

api.get('/events', EventController.index)
api.post('/events', EventController.store)
api.post('/events/invoice', EventController.invoice)
api.get('/events/:slug', EventController.show)
api.get('/events/detail/:id', EventController.detail)
api.put('/events/:id', EventController.update)
api.delete('/events/:id', EventController.destroy)

api.post('/events/orders/pay/:invoice', EventOrderController.update)
api.post('/events/orders/invoice/:invoice', EventOrderController.invoice)
api.get('/events/orders/detail/:invoice', EventOrderController.show)
api.post('/events/orders/refund/:invoice', EventOrderController.refund)

api.post('/participants', ParticipantController.store)

api.get('/product-recommend', ProductRecommendController.index)
api.post('/product-recommend', ProductRecommendController.store)
api.get('/product-recommend/:id', ProductRecommendController.show)
api.put('/product-recommend/:id', ProductRecommendController.update)
api.patch('/product-recommend/set-note/:id', ProductRecommendController.setNote)
api.delete('/product-recommend/:id', ProductRecommendController.destroy)

api.get('/1688/notes', Order1688NoteController.index)
api.post('/1688/notes', Order1688NoteController.store)
api.get('/1688/notes/:id', Order1688NoteController.show)
api.put('/1688/notes/:id', Order1688NoteController.update)

export default api