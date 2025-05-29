export const AUTO_DELETE_SUFFIXS = ["1m", "5m", "1h", "1d", "7d", "1m", "never"] as const;
export type AutoDeleteSuffix = (typeof AUTO_DELETE_SUFFIXS)[number];

export interface NoteDOM {
  id: string;
  iv: string;
  destructive: boolean;
  content: string;
  author: string;
  expiresAt: Date;
  createdAt: Date;
}
