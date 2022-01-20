import express from 'express'
import dotenv from 'dotenv'
import ApiRouter from './router/api.mjs'
import cors from 'cors'

dotenv.config();
const app = express();
const PORT = process.env.APP_PORT
const HOST = process.env.APP_HOST
app.use(cors())
app.use(express.json())

app.use('/api', ApiRouter)
app.use('/', (req, res) => {
    res.send('hellos')
})


app.listen(PORT, () => {
  console.log(`App listening at http://${HOST}:${PORT}`)
});