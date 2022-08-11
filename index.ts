import express, { Request, Response } from 'express'
import * as swaggerJson from './dist/swagger.json'
import * as swaggerUI from 'swagger-ui-express'
import mongoose from 'mongoose'
import Modules from './modules'
import dotenv from 'dotenv';

dotenv.config()

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(['/docs'], swaggerUI.serve, swaggerUI.setup(swaggerJson))

app.use('/api/v1', Modules)

app.get('/health', (_req: Request, res: Response) => {
  res.send('Healthy')
})

mongoose
  .connect(`${process.env.DB_CONN}`)
  .then(() => console.log('Succesfully connected to database!'))
  .catch((error) => console.log(error))

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`)
})
