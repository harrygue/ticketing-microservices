import express,{ Request,Response } from 'express'
import { body,validationResult } from 'express-validator'
import { User } from '../models/user'
import { RequestValidationError } from '../errors/request-validation-error'
import { BadRequestError } from '../errors/bad-request-error'

const router = express.Router()

router.get('/api/users/signup',[
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim() //remove leading - trailing empty spaces
      .isLength({min: 4, max: 20})
      .withMessage('Password must be between 4 and 20 characters!')
  ], async (req:Request,res:Response) => {
    const errors = validationResult(req);
    console.log('hit signup')
    if (!errors.isEmpty()){
      // return res.status(400).send(errors.array())
      throw new RequestValidationError(errors.array());
    }
    
    const { email,password } = req.body;
    const existingUser = await User.findOne({email})

    // check is email exist
    if (existingUser){
      throw new BadRequestError('Email in use')
    }

    // password hashing later

    const user = User.build({email,password})
    await user.save()

    res.status(201).send(user);
})

export { router as signupRouter}