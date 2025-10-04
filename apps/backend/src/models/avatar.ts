import { Schema, model, Document } from 'mongoose';

export interface IAvatar extends Document {
  user_id: Schema.Types.ObjectId;
  username: string;
  avatar_url: string;
  public_id: string;
  size?: number; // Made size optional
  createdAt: Date;
  updatedAt: Date;
}

const AvatarSchema = new Schema<IAvatar>(
  {
    user_id: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    username: { type: String, required: true },
    avatar_url: { type: String, required: false },
    public_id: { type: String, required: false },
    size: { type: Number, required: false, default: 0 }, // Made size not required and added default
  },
  {
    timestamps: true,
  }
);

const AvatarModel = model<IAvatar>('avatar', AvatarSchema);

export default AvatarModel;
