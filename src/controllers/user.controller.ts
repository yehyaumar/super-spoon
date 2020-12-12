import { Request, Response, NextFunction } from "express";
import { check, sanitize, validationResult } from 'express-validator'
import { FormatResponse, IFormatResponse } from "../utils/response.format";
import { User } from "../models/user.model";


export const register = async (req: Request, res: Response, next: NextFunction): Promise<IFormatResponse> =>{
  await check("email", "Email is not valid").isEmail().run(req);
  await check("username", "Username not valid").isString().run(req);
  await check("password", "Password must be at 8-256 characters long").isLength({ min: 8, max: 256 }).run(req);

  // await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    res.status(400).json(new FormatResponse(false, errors.array()[0].msg, 400 ))
    return;
  }

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
  try{
    const existingUser = await User.findOne().or([{email: req.body.email}, { username: req.body.username }]);
    if(existingUser){
      res.status(400).json(new FormatResponse(false, "User with this email or username already exists", 400 ))
      return;
    }
    
    const savedRes = await user.save();
    res.status(200).json(new FormatResponse(true, "User registered successfully", savedRes.cleanedUser()))
    
  }catch(err){
    res.status(400).json(new FormatResponse(false, err));
    return;
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  if(!username || !password ){
    res.status(400).json(new FormatResponse(false, "Invalid username or password"));
  }

  try{
    const user = await User.findOne({username} );
    if (user && await user.isValidPassword(password)) {
      const token = user.generateJWT();
      res.status(200).json(new FormatResponse(true, "Logged in successfully", user.userWithToken(token)))
    } else {
      res.status(400).json(new FormatResponse(false, "Invalid username or password"));
    }
  }catch(err){
    console.log("LoginController", err)
    res.status(500).json(new FormatResponse(false, "Internal Server Error"));
    return;
  }
}

export const profile = async (req: Request, res: Response, next: NextFunction) => {
  
  console.log("PROFILE", req.user)
  res.json(req.user)
}

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  const users = await User.find()
  const cleanedUsers = [];

  for(const user of users){
    cleanedUsers.push(user.cleanedUser());
  }
  
  res.status(200).json(new FormatResponse(true, "All Users", cleanedUsers))
}

export const getUserDetails = (req: Request, res: Response, next: NextFunction) => {
  
}