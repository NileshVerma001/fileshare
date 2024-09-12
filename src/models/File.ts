// src/models/File.ts
import { Schema, model, models } from 'mongoose';

const FileSchema = new Schema({
  filename: { type: String, required: true },
  fileUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
},{ timestamps: true });

const File = models.File || model('File', FileSchema);

export default File;
