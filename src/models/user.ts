import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
}

const urlRegex = /^(https?:\/\/)(www\.)?[\w\-._~:/?#[\]@!$&'()*+,;=]+#?$/;

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v: string) => urlRegex.test(v),
      message: 'Некорректный URL в avatar',
    },
  },
});

export default mongoose.model<IUser>('user', userSchema);
