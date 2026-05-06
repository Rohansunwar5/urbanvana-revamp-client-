import mongoose from 'mongoose';

export interface IContactLead extends mongoose.Schema {
  fullName: string;
  email: string;
  subject: string;
  message: string;
  iss: string;
  isdCode: string;
  phoneNumber: string;
}

const contactLeadSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, minLength: 2 },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    iss: { type: String, required: true },
    isdCode: { type: String },
    phoneNumber: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models['contactLead'] ??
  mongoose.model<IContactLead>('contactLead', contactLeadSchema);
