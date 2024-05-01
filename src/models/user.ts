import {InferSchemaType, model, Schema} from 'mongoose';

const userSchema = new Schema(
  {
    fullName: {type: String, required: true},
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: [true, 'Email already in use'],
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Invalid Email address'
      ]
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: [true, 'Phone number already in use'],
      minLength: [11, 'Phone number less than 11 digits']
    },
    dateOfBirth: {type: Date},
    password: {type: String, required: [true, 'Password is required']},
    emailVerified: {type: Boolean, default: false},
    role: {type: String, enum: ['user', 'admin'], default: 'user'}
  },
  {timestamps: true}
);

type User = InferSchemaType<typeof userSchema>;

export default model<User>('user', userSchema);
