import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config()

const Schema = mongoose.Schema;

export type UserDocument = mongoose.Document & {
  username: string,
  email: string,
  password: string,
  cleanedUser: Function,
  isValidPassword: Function,
  generateJWT: Function,
  userWithToken: Function
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 256
  }
}, { timestamps: true})

UserSchema.pre('save', async function save(next){
  const user = this as UserDocument;
  if(!user.isModified('password')) {
    return next()
  }
  try{
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
  }catch(err){
    return next(err);
  }
})
type comparePasswordFunction = ( candidatePassword: string, cb: ( err: any, isMatch: any) => {}) => void;

UserSchema.methods.isValidPassword = function(candidatePassword){
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password)
      .then(result => resolve(result))
      .catch(err => reject(err));
  })
}

UserSchema.methods.cleanedUser = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    createdAt: this.createdAt
  }
}

UserSchema.methods.generateJWT = function(){
  let today = new Date();
  let expiry = new Date(today);

  expiry.setDate(today.getDate() + 1);

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: Math.round(Number(expiry.getTime() / 1000))
  }, process.env.JWT_SECRET)
}

UserSchema.methods.userWithToken = function(token){
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    token,
    createdAt: this.createdAt
  }
}

export const User = mongoose.model<UserDocument>('User', UserSchema)
