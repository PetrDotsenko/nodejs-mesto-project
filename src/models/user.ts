import mongoose, { Document } from 'mongoose';
import isEmail from 'validator/lib/isEmail';

export interface IUser extends Document {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

const urlRegex = /^(https?:\/\/)(www\.)?[\w\-._~:/?#[\]@!$&'()*+,;=]+#?$/;

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v: string) => urlRegex.test(v),
      message: 'Некорректный URL в avatar',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => isEmail(v),
      message: 'Некорректный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

export default mongoose.model<IUser>('user', userSchema);
