/* Just to configure, starting the server happens in index.ts */

import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cors from 'cors'

import cookieSession from 'cookie-session'

import { errorHandler,NotFoundError,currentUser} from '@harrygueorg/common'
import { createTicketRouter } from './routes/new'
import { showTicketRouter } from './routes/show'
import { indexTicketsRouter } from './routes';
import { updateTicketRouter} from './routes/update'

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

app.use(currentUser)

app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketsRouter)
app.use(updateTicketRouter)


// asynchronous Error Handling
app.all('*', async ()=> {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app };