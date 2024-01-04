import { Router } from 'express'
import { UserController } from '../controller/user.controller'

const userRouter = Router()
const userController = new UserController()

userRouter.get('/', async (req, res, next) => {
  await userController.all(req, res, next)
})
userRouter.get('/:id', async (req, res, next) => {
  await userController.one(req, res, next)
})

userRouter.post('/', async (req, res, next) => {
  await userController.save(req, res, next)
})

userRouter.patch('/:id', async (req, res, next) => {
  await userController.edit(req, res, next)
})

userRouter.delete('/:id', async (req, res, next) => {
  await userController.remove(req, res, next)
})

userRouter.post('/sendEmail', async (req, res, next) => {
  await userController.sendEmail(req, res, next)
})
// userRouter.post('/send-email', userController.sendEmail.bind(userController))

export default userRouter
