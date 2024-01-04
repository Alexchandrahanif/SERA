import express from 'express'
import { AppDataSource } from './data-source'
import router from './routes/index'

export const startServer = async () => {
  try {
    await AppDataSource.initialize()
    const app = express()

    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    app.use('/', router)

  

    const port = 3000;
    app.listen(port, () => {
      console.log('Connected')
    })
  } catch (error) {
    console.error('Error during initialization:', error)
  }
}

startServer()
