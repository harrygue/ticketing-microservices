import express,{Request,Response} from 'express'
import jwt from 'jsonwebtoken'
import { requireAuth } from '@harrygueorg/common'

import { currentUser } from '@harrygueorg/common';// '../middlewares/current-user';

const router = express.Router()

// middleware: currentUser, requireAuth
// Stephen deleted requireAuth middleware in video 187 quite at the end, now idea why ? I leave it as is !
router.get('/api/users/currentuser',currentUser,/*requireAuth,*/(req:Request,res:Response) => {
  console.log('CURRENT USER:', req.currentUser)
  res.send({currentUser: req.currentUser || null});

  // Code below not needed because of currentUser middleware
  
  // TS: equivalent to (!req.session || req.session.jwt)
  /*
  if (req.session?.jwt){
    return res.send({currentUser:null})
  }

  try {
    // process.env.jwt already checked and defined in index.ts start function!
    // ? after req.session - necessary in my case, not in SG's case !!!
    console.log('JWT:',req.session?.jwt)
    console.log('PROCESS.ENV.JWT:',process.env.jwt)
    const payload = jwt.verify(req.session?.jwt,process.env.jwt!);
    console.log('PAYLOAD: ',payload)
    res.send({currentUser: payload})
  } catch(err){
    // if the jwt is invalid
    console.log('JWT INVALID')
    return res.send({currentUser:null})
  }
  */
})

export { router as currentUserRouter}