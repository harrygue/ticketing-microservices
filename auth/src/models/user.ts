import mongoose from 'mongoose'
import { Password } from '../services/password'

// Interface that descibes the properties
// that are required to create a new User

interface UserAttrs {
  email: string;
  password: string;
}

// Interface that describes the properties
// that a User Model has
/*Generic type 'Model<T, TQueryHelpers, TMethods>' requires between 1 and 3 type arguments.*/
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs:UserAttrs):UserDoc;
}

// Interface describing properties that a User Document (or record) has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  // we would add here additional properties existing in the document
}

const userSchema = new mongoose.Schema({
  email: {
    type: String, // mongoose requirement, not TS
    required: true
  },
  password: {
    type: String,
    required: true
  }
})

// middleware function implemented in mongoose
// will be executed everytime if we try to query a user from the db
// done is needed due to behavior of mongoose
// function keyword instead of arrow otherwise 'this' would point to the instance of the class,
// and not to to the user record
// also when we create a user then .isModified will return 'true'
userSchema.pre('save', async function(done){
  if (this.isModified('password')){
    const hashed = await Password.toHash(this.get('password'))
    this.set('password',hashed)
  }
  done()
})


userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

const User = mongoose.model<UserDoc,UserModel>('User', userSchema)

export { User }