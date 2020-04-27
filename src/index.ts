import * as express from 'express';
import * as mongoose from 'mongoose';
import { userRouter } from './routes/user.routes';

const url = "mongodb://127.0.0.1:27017/users";

const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

mongoose.connect(url, { useNewUrlParser: true });
const db = mongoose.connection;

db.once('open', _ => {
  console.log('DB connected', url)
})

db.on('error', err => {
  console.log('connection error', err)
})

app.use('/user', userRouter)

app.listen(3000, function(){
  console.log("Starting out project in nodejs");
})