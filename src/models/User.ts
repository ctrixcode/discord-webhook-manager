import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  discord_id?: string;
  createdAt: Date;
  updatedAt: Date;
  deleted_at?: Date | null;
}

const UserSchema = new Schema<IUser>({
  deleted_at: { type: Date, default: null },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  discord_id: { type: String, required: false, unique: true, sparse: true },
},
{
  timestamps: true,
});

const UserModel = model<IUser>('User', UserSchema);

export default UserModel;
