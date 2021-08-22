import express,{ Request,Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'

import { validateRequest,BadRequestError } from '@harrygueorg/common'
import { User } from '../models/user'

const router = express.Router()

router.post('/api/users/signup',[
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim() //remove leading - trailing empty spaces
      .isLength({min: 4, max: 20})
      .withMessage('Password must be between 4 and 20 characters!')
  ],
  validateRequest,
  async (req:Request,res:Response) => {
    // error handling stuff removed because we use validateResult middleware
    
    const { email,password } = req.body;
    const existingUser = await User.findOne({email})

    // check is email exist
    if (existingUser){
      throw new BadRequestError('Email in use')
    }

    // password hashing later

    const user = User.build({email,password})
    await user.save()

    // Generate JWT
    const userJwt = jwt.sign({
      id: user.id,
      email: user.email
    },
    process.env.jwt!) 
    // Typescript complains but at runtime we did the check already in index.ts

    // Store it on session object
    req.session = {
      jwt: userJwt  // Typescript style: write out the object rather than chaining
    }
    console.log('USER: ',user)
    res.status(201).send(user);
})

export { router as signupRouter}