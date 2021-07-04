import mongoose from 'mongoose'
import {app} from './app'

const start = async () => {
  // check if jsonwebtoken has beed defined at app start
  if (!process.env.jwt){
    throw new Error('jwt must be defined!')
  }

  if (!process.env.AUTH_MONGO_URI) {
    throw new Error('MONGO_URI must be defined!')
  }

  try {
    await mongoose.connect(process.env.AUTH_MONGO_URI,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true  
    })
    console.log('CONNECTED TO MONGODB auth')
  } catch(err){
    console.log(err)
  }

  app.listen(3001,() => {
    console.log('listening on 3001!!!')
  })
}

start()