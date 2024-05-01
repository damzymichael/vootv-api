import {InferSchemaType, model, Schema} from 'mongoose';

const audioSchema = new Schema({
  link: {type: String, required: [true, 'Audio link is required']},
  timeRecorded: {type: Date, required: [true, 'Time recorded is required']},
  preacher: {type: String, required: true}
}, {timestamps: true});

type Audio = InferSchemaType<typeof audioSchema>;

export default model<Audio>('audio', audioSchema);
