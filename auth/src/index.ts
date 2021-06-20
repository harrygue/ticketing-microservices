import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'

import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signupRouter } from './routes/signup'
import { signoutRouter } from './routes/signout'
import { errorHandler} from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'

const app = express()
app.set('trust proxy',true) // traffic is proxied through ingress-nginx

app.use(json())
app.use(
  cookieSession({
    signed: false, // no encryption
    secure: true // https 
  })
)

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signupRouter)
app.use(signoutRouter)

// asynchronous Error Handling
app.all('*', async ()=> {
  throw new NotFoundError()
})

app.use(errorHandler)

const start = async () => {
  // check if jsonwebtoken has beed defined at app start
  if (!process.env.jwt){
    throw new Error('jwt must be defined!')
  }

  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth',{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true  
    })
    console.log('CONNECTED TO MONGODB')
  } catch(err){
    console.log(err)
  }

  app.listen(3000,() => {
    console.log('listening on 3000!!!')
  })
}

start()