import { Request, Response, NextFunction } from "express";
import { check, sanitize, validationResult } from 'express-validator'
import { FormatResponse } from "../utils/response.format";
import { User } from "../models/user.model";


export const register = async (req: Request, res: Response, next: NextFunction) =>{
  await check("email", "Email is not valid").isEmail().run(req);
  await check("username", "Username not valid").isString().run(req);
  await check("password", "Password must be at 8-256 characters long").isLength({ min: 8, max: 256 }).run(req);

  await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    console.log(errors.array())
    res.status(400).json(new FormatResponse(false, errors.array()[0].msg, 400 ))
  }

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
  try{
    const existingUser = await User.findOne().or([{email: req.body.email}, { username: req.body.username }]);
    console.log("[UserController]", existingUser)
    if(existingUser){
      res.status(400).json(new FormatResponse(false, "User with this email or username already exists", 400 ))
    }
    
    const savedRes = await user.save();
    res.status(200).json(new FormatResponse(true, "User registered successfully", 200, savedRes.cleanedUser()))
    
  }catch(err){
    res.status(400).json(new FormatResponse(false, err, 400 ))
  }
}

export const getUserDetails = (req: Request, res: Response, next: NextFunction) => {
  
}