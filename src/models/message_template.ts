import { Schema, model, Document } from 'mongoose';
import { EmbedSchema } from '../models/embed';

interface IEmbedInMessageTemplate {
  title?: string;
  description?: string;
  url?: string;
  color?: string;
  timestamp?: Date;
  image?: {
    url: string;
  };
  thumbnail?: {
    url: string;
  };
  author?: {
    name: string;
    url?: string;
    icon_url?: string;
  };
  fields?: {
    name: string;
    value: string;
    inline?: boolean;
  }[];
  footer?: {
    text: string;
    icon_url?: string;
  };
}

export interface IMessageTemplate extends Document {
  user_id: Schema.Types.ObjectId;
  name: string;
  description?: string;
  content: string;
  avatar_ref: Schema.Types.ObjectId;
  embeds: IEmbedInMessageTemplate[];
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageTemplate = new Schema<IMessageTemplate>(
  {
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    name: { type: String, required: true },
    description: { type: String },
    content: { type: String, required: true },
    avatar_ref: { type: Schema.Types.ObjectId, required: true, ref: 'Avatar' },
    embeds: [EmbedSchema],
    attachments: [{ type: String }],
    createdAt: { type: Date, required: true, default: Date.now },
    updatedAt: { type: Date, required: true, default: Date.now },
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
