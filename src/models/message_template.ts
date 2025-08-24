import { Schema, model, Document } from 'mongoose';
import { EmbedSchema, IEmbedSchemaDocument } from '../models/embed';

export interface IMessageTemplate extends Document {
  user_id: Schema.Types.ObjectId;
  name: string;
  description?: string;
  content: string;
  avatar_ref: Schema.Types.ObjectId;
  embeds: IEmbedSchemaDocument[];
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageTemplate = new Schema<IMessageTemplate>(
  {
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    description: { type: String },
    content: { type: String },
    avatar_ref: { type: Schema.Types.ObjectId, ref: 'Avatar' },
    embeds: [EmbedSchema],
    attachments: [{ type: String }],
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
  },
  {
    timestamps: true,
  }
);

MessageTemplate.pre('validate', function (next) {
  if (!this.content && (!this.embeds || this.embeds.length === 0)) {
    this.invalidate(
      'content',
      'Either content or embeds must be provided.',
      null
    );
  }
  next();
});

const MessageTemplateModel = model<IMessageTemplate>(
  'Message_template',
  MessageTemplate
);

export default MessageTemplateModel;
