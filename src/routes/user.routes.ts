import { Router } from 'express';
import { register, getAllUsers, login, profile } from '../controllers/user.controller';
import * as passport from 'passport';

export const userRouter = Router();

userRouter.route('/')
  .get(getAllUsers)

userRouter.route('/register')
  .post(register);

userRouter.route('/login')
  .post(login)

userRouter.route('/me')
  .get(passport.authenticate('jwt', { session: false, failWithError: true }), profile)
