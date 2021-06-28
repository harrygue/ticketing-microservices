import express from 'express'
import jwt from 'jsonwebtoken'
import { requireAuth } from '../middlewares/require-auth'

import { currentUser } from '../middlewares/current-user'

const router = express.Router()

// middleware: currentUser, requireAuth
// Stephen deleted requireAuth middleware in video 187 quite at the end, now idea why ? I leave it as is !
router.get('/api/users/currentuser',currentUser,requireAuth,(req,res) => {
  
  res.send({currentUser: req.currentUser || null});

  // Code below not needed because of currentUser middleware
  
  // TS: equivalent to (!req.session || req.session.jwt)
  // if (req.session?.jwt){
  //   return res.send({currentUser:null})
  // }

  // try {
  //   // process.env.jwt already checked and defined in index.ts start function!
  //   // ? after req.session - necessary in my case, not in SG's case !!!
  //   const payload = jwt.verify(req.session?.jwt,process.env.jwt!);
  //   res.send({currentUser: payload})
  // } catch(err){
  //   // if the jwt is invalid
  //   return res.send({currentUser:null})
  // }
  
})

export { router as currentUserRouter}