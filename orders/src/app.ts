/* Just to configure, starting the server happens in index.ts */

import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cors from 'cors'

import cookieSession from 'cookie-session'

import { errorHandler,NotFoundError} from '@harrygueorg/common'
import { newOrderRouter } from './routes/new'
import { showOrderRouter } from './routes/show'
import { indexOrderRouter } from './routes';
import { deleteOrderRouter} from './routes/delete'

const app = express()
app.set('trust proxy',true) // traffic is proxied through ingress-nginx

/* THIS CORS INSTRUCTIONWAS ADDED BY H.G. TO TEST THE SIGNUP ROUTE FROM MY TEST-TICKETING-MSAPP */
// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
const allowedOrigins = ['http://localhost:3000'];

const options: cors.CorsOptions = {
  origin: allowedOrigins
};

app.use(cors(options))

app.use(json())

app.use(
  cookieSession({
    signed: false, // no encryption
    secure: process.env.NODE_ENV !== 'test' 
    // for https it's true, when running tests with jest then jest 
    // sets the env variable to 'test'
  })
)

app.use(newOrderRouter)
app.use(showOrderRouter)
app.use(indexOrderRouter)
app.use(deleteOrderRouter)


// asynchronous Error Handling
app.all('*', async ()=> {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app };