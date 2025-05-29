# unseen

E2E encrypted note sharing service.

![image](https://github.com/user-attachments/assets/6c40d0c1-8563-4881-b27d-20dd174f27f8)
![image](https://github.com/user-attachments/assets/3c336362-2f9b-4b28-86eb-f7a1701d8eb1)

### Features

- E2E Encryption
- Expiration Duration 
- Burn after read

## E2E

Random encryption key is generated at client side and stored in **url hash** for decrypt, the encryption key and raw content never being sent to the server, server stores **IV** and **encrypted content** only. Thus we follow E2E practices.
Encryption is done with [tweetnacl](https://www.npmjs.com/package/tweetnacl)'s **secretbox** API.

### Stack

- [antdv](https://antdv.com/components/overview) UI library
- [tweetnacl](https://www.npmjs.com/package/tweetnacl) for encryption
- [yup](https://www.npmjs.com/package/yup) for validation
- [mongoose](https://www.npmjs.com/package/mongoose) for database
- [parse-duration](https://www.npmjs.com/package/parse-duration) for parsing the TTL

### Run locally

Configure `.env` for **MONGODB_URI** and run `npm run dev`.


