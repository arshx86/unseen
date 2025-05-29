# unseen

E2E encrypted note pastebin. Made with NuxtJS <3

### Features

- Fully E2E encrypted
- Expiration duration (TTL)
- Burn after read

## Encryption

Notes are encrypted with AES-256-GCM and a random key in client-side. The key is encoded in the URL hash, stored and transmitted as encrypted.
Database has no any info other than a **IV** and **encrypted content**.

- [tweetnacl util](https://www.npmjs.com/package/tweetnacl-util) helped in encoding and decoding the key.

### Stack

- [antdv](https://antdv.com/components/overview) ui library
- [tweetnacl](https://www.npmjs.com/package/tweetnacl) for encryption
- [tweetnacl-util](https://www.npmjs.com/package/tweetnacl-util) for encoding and decoding the key
- [yup](https://www.npmjs.com/package/yup) for validation
- [mongoose](https://www.npmjs.com/package/mongoose) for database
- [parse-duration](https://www.npmjs.com/package/parse-duration) for parsing the TTL

### Run locally

Configure `.env` for **MONGODB_URI** and run `npm run dev`.

```bash

```
