import { Schema, Document } from 'mongoose';

export interface IEmbedSchemaDocument extends Document {
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
  fields?: IFields[];
  footer?: {
    text: string;
    icon_url?: string;
  };
}
export interface IFields {
  name: string;
  value: string;
  inline?: boolean;
}

export const EmbedSchema = new Schema<IEmbedSchemaDocument>({
  title: { type: String },
  description: { type: String },
  url: { type: String },
  color: { type: String },
  timestamp: { type: Date },
  image: {
    url: { type: String },
  },
  thumbnail: {
    url: { type: String },
  },
  author: {
    name: { type: String },
    url: { type: String },
    icon_url: { type: String },
  },
  fields: [
    {
      name: { type: String },
      value: { type: String },
      inline: { type: Boolean },
    },
  ],
  footer: {
    text: { type: String },
    icon_url: { type: String },
  },
});
