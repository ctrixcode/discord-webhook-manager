import { Schema, model, Document } from 'mongoose';

export interface IMessageTemplate extends Document {
  user_id: Schema.Types.ObjectId;
  name: string;

  createdAt: Date;
  updatedAt: Date;
}

const MessageTemplate = new Schema<IMessageTemplate>(
  {
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

const MessageTemplateModel = model<IMessageTemplate>(
  'Message_template',
  MessageTemplate
);

export default MessageTemplateModel;
