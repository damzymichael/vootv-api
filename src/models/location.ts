import {InferSchemaType, model, Schema} from 'mongoose';

const locationSchema = new Schema({
  country: {type: String, required: [true, 'Country is required']},
  state: {type: String, required: [true, 'State is required']},
  address: {type: String, required: [true, 'Address is required']},
  pastorInCharge: {type: String, required: [true, 'Pastor in charge is required']}, 
  mapLocation: {type: {longitude: Number, latitude: Number}},
  services: [{ type: Schema.Types.ObjectId, ref: 'service' }]
}, {timestamps: true});

type Location = InferSchemaType<typeof locationSchema>;

export default model<Location>('location', locationSchema);
