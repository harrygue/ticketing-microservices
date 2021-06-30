import mongoose from 'mongoose'
import {app} from './app'

const start = async () => {
  // check if jsonwebtoken has beed defined at app start
  if (!process.env.jwt){
    throw new Error('jwt must be defined!')
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined!')
  }

  try {
    await mongoose.connect(process.env.MONGO_URI,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true  
    })
    console.log('CONNECTED TO MONGODB tickets')
  } catch(err){
    console.log(err)
  }

  app.listen(3001,() => {
    console.log('listening on 3001!!!')
  })
}

start()