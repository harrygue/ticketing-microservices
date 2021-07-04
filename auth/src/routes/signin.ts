import express,{Request,Response} from 'express'
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { Password } from '../services/password';
import { User } from '../models/user';
import { validatateRequest,BadRequestError } from '@harrygueorg/common'

const router = express.Router()

router.post('/api/users/signin',[
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password!')
  ],
  validatateRequest,
  async (req:Request,res:Response) => {
    // error handling stuff removed because we use validateResult middleware
    const { email, password } = req.body;

    // Does a user with this email exist? If not, respond with an error
    const existingUser = await User.findOne({email});
    if (!existingUser){
      throw new BadRequestError('Invalid credentials!')
    }

    // Compare the passwords of the stored user and the supplied password
    const passwordsMatch = await Password.compare(
      existingUser.password, 
      password
    );

    // if passwords aren't the same throw an error
    if (!passwordsMatch){
      throw new BadRequestError('Invalid credentials!')
    }

    // User is now considered to be logged in. Send them a JWT in a cookie
    // Generate JWT
    const userJwt = jwt.sign({
      id: existingUser.id,
      email: existingUser.email
    },
    process.env.jwt!) 
    // Typescript complains but at runtime we did the check already in index.ts

    // Store it on session object
    req.session = {
      jwt: userJwt,  // Typescript style: write out the object rather than chaining
      test:'test'
    }
    res.status(200).send(existingUser);
})

export { router as signinRouter}