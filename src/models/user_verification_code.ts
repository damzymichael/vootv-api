import {InferSchemaType, model, Schema} from 'mongoose';

const otpSchema = new Schema({
  userId: {type: Schema.Types.ObjectId, required: true, ref: 'user'},
  otp: {type: String, required: true},
  action: {type: String, enum: ['email-verification', 'password-reset']},
  createdAt: {type: Date, default: Date.now, expires: '15m'}
});

type OTPSchema = InferSchemaType<typeof otpSchema>;

export default model<OTPSchema>('verification-code', otpSchema);
