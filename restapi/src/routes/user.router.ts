import { Router } from 'express'
import { UserController } from '../controller/user.controller'

const userRouter = Router()
const userController = new UserController()

userRouter.get('/', async (req, res, next) => {
  await userController.getAll(req, res, next)
})

userRouter.get('/:id', async (req, res, next) => {
  await userController.getOne(req, res, next)
})

userRouter.post('/login', async (req, res, next) => {
  await userController.login(req, res, next)
})

userRouter.post('/', async (req, res, next) => {
  await userController.create(req, res, next)
})

userRouter.patch('/:id', async (req, res, next) => {
  await userController.update(req, res, next)
})

userRouter.delete('/:id', async (req, res, next) => {
  await userController.delete(req, res, next)
})

userRouter.post('/sendEmail', async (req, res, next) => {
  await userController.sendEmail(req, res, next)
})
export default userRouter
