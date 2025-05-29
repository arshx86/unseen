import Note from "~/server/models/Note";
import * as yup from "yup";
import parse from "parse-duration";
import { AUTO_DELETE_SUFFIXS } from "~/shared/exports";

const schema = yup.object({
  content: yup.string().required(), // enc
  expires: yup.string().oneOf(AUTO_DELETE_SUFFIXS).default("never"),
  destructive: yup.boolean().default(false),
  iv: yup.string().required(), // encryption iv
  author: yup
    .string()
    .max(10)
    .transform((value) => value || "anonymous"),
});

export default defineEventHandler(async (event) => {
  const { content, expires, destructive, iv, author } = await schema.validate(
    await readBody(event)
  );

  let expiresAt = null;
  if (expires !== "never") {
    const duration = parse(expires);
    if (!duration || duration <= 0) {
      throw createError({
        statusCode: 400,
        message: "Invalid expiration duration",
      });
    }
    expiresAt = new Date(Date.now() + duration);
  }

  const note = await Note.create({
    content,
    iv,
    expiresAt: expiresAt,
    destructive,
    author,
  });

  return { id: note._id.toString() };
});
