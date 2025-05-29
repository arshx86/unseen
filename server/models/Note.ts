import { Schema, model, Document } from "mongoose";

const NoteSchema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: String, default: "anonymous" },
    destructive: { type: Boolean, default: false }, // burn after read
    iv: { type: String, required: true }, // encryption iv
    expiresAt: { type: Date }, // for index
  },
  {
    timestamps: true,
  }
);

NoteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const Note = model("Note", NoteSchema);

export default Note;
