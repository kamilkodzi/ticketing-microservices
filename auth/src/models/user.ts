import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describe the properties
// that are require to create new User
interface UserArrts {
  email: string;
  password: string;
}

// An nterface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserArrts): UserDoc;
}

// An Interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password') as string);
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (atrrs: UserArrts) => {
  return new User(atrrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
