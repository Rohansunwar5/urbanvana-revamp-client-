import contactLeadModel from '@/lib/models/contactLead.model';

export interface IContactLeadParams {
  email: string;
  fullName: string;
  iss: string;
  message: string;
  subject: string;
  isdCode?: string;
  phoneNumber?: string;
}

export class ContactLeadRepository {
  private _model = contactLeadModel;

  async create(params: IContactLeadParams) {
    const { email, fullName, iss, message, subject, isdCode, phoneNumber } = params;
    return this._model.create({ email, fullName, iss, message, subject, isdCode, phoneNumber });
  }
}
