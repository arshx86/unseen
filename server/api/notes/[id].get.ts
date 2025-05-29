import Note from "~/server/models/Note";
import * as yup from "yup";
import { isValidObjectId } from "mongoose";
import type { NoteDOM } from "~/shared/exports";

const validate = yup.object({
  id: yup
    .string()
    .required()
    .test("is-valid-id", "Invalid note ID", (value) => {
      return isValidObjectId(value);
    }),
});

export default defineEventHandler(async (event) => {
  const { id } = await validate.validate(getRouterParams(event));
  const note = await Note.findById(id);

  if (!note) {
    throw createError({
      statusCode: 404,
      message: "Note not found",
      fatal: true,
    });
  }

  // if destructive, delete after fetch
  if (note.destructive) {
    await Note.findByIdAndDelete(id);
  }

  return {
    content: note.content,
    iv: note.iv,
    destructive: note.destructive,
    expiresAt: note.expiresAt,
    createdAt: note.createdAt,
    author: note.author,
  } as NoteDOM;
});
