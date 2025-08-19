import { Schema, model, Document } from 'mongoose';

export interface IAvatar extends Document {
  user_id: Schema.Types.ObjectId;
  username: string;
  avatar_url: string;
  avatar_icon_url: string;
  createdAt: Date;
  updatedAt: Date;
}

const AvatarSchema = new Schema<IAvatar>(
  {
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    username: { type: String, required: true },
    avatar_url: { type: String, required: false },
    avatar_icon_url: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const AvatarModel = model<IAvatar>('Avatar', AvatarSchema);

export default AvatarModel;
