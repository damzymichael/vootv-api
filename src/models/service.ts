import {InferSchemaType, model, Schema} from 'mongoose';

const serviceSchema = new Schema({
  day: String,
  startTime: String,
  endTime: String,
  theme: String,
  locationId: {type: Schema.Types.ObjectId, ref: 'location'}
}, {timestamps: true});

type Service = InferSchemaType<typeof serviceSchema>;

export default model<Service>('service', serviceSchema);
