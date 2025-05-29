import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";

export function encryptContent(content: string, key: Uint8Array) {
  const iv = nacl.randomBytes(24);
  const contentBytes = naclUtil.decodeUTF8(content);
  const encryptedContent = nacl.secretbox(contentBytes, iv, key);

  return {
    iv: naclUtil.encodeBase64(iv),
    encryptedContent: naclUtil.encodeBase64(encryptedContent),
  };
}

export function decryptContent(
  // r: {iv,encCon}
  encryptedData: { iv: string; encryptedContent: string },
  key: Uint8Array
) {
  const iv = naclUtil.decodeBase64(encryptedData.iv);
  const encryptedContent = naclUtil.decodeBase64(encryptedData.encryptedContent);

  const decryptedContent = nacl.secretbox.open(encryptedContent, iv, key);

  if (!decryptedContent) throw new Error("Decryption failed", { cause: "decryption_error" });

  return naclUtil.encodeUTF8(decryptedContent);
}
