import { Router, Request, Response } from 'express'
import UsersController from './users.controller'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  const { statusCode, body } = await UsersController.getUsers(req)
  res.status(statusCode).send(body)
})

router.get('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params
  const { statusCode, body } = await UsersController.getUserById(req, userId)
  res.status(statusCode).send(body)
})

router.post('/', async (req: Request, res: Response) => {
  const { statusCode, body } = await UsersController.addUser(req, req.body)
  res.status(statusCode).send(body)
})

router.post('/login', async (req: Request, res: Response) => {
  const { statusCode, body } = await UsersController.logInUser(req, req.body)
  res.status(statusCode).send(body)
})

export default router
