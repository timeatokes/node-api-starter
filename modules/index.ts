import express from 'express'

import UsersRouter from './users/users.router'
import PetsRouter from './pets/pets.router'

const app = express()

app.use('/users/', UsersRouter);
app.use('/pets/', PetsRouter);

export default app
