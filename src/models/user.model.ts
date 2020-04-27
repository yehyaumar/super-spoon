import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt'

const Schema = mongoose.Schema;

export type UserDocument = mongoose.Document & {
  username: string,
  email: string,
  password: string,
  comparePassword: comparePasswordFunction,
  cleanedUser: Function
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


const comparePassword: comparePasswordFunction = function (candidatePassword, cb){
  bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
    cb(err, isMatch);
  })
} 

UserSchema.methods.comparePassword = comparePassword;

UserSchema.methods.cleanedUser = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    createdAt: this.createdAt
  }
}

export const User = mongoose.model<UserDocument>('User', UserSchema)
