import { Router } from 'express';
import { register, getAllUsers } from '../controllers/user.controller';

export const userRouter = Router();

userRouter.route('/')
  .get(getAllUsers)

userRouter.route('/register')
  .post(register);
