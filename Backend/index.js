import express from 'express'
import logger from 'morgan'
import { connectDb } from './config/db.js'
import userRouter from './routes/user.route.js'
import cors from "cors"
import fileUpload from 'express-fileupload'
import { CloudinaryConnect } from './config/cloudinary.js'
import cookieParser from 'cookie-parser';
import profileRouter from './routes/profile.route.js'
import jobRouter from './routes/job.route.js'



const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(fileUpload({ 
  useTempFiles: true,
  tempFileDir: "/tmp/",
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(logger('dev'))

const port = process.env.PORT || 4000

app.use("/api/v1/auth",userRouter)

app.use("/api/v1/profile",profileRouter)
app.use("/api/v1/jobs",jobRouter)




app.listen(port,()=>{
    connectDb();
    CloudinaryConnect();
    console.log(`server connected at ${port}`);
})


