# ChatApp-MERN-Stack

It's sample of exchanging encrypted messages between server and client using Diffie-Hellman key exchanges. Client encryption side is using Crypto Module. Server side is using Nodejs crypto and node-rsa.

To establish a secure communication channel. This channel is used by the systems to exchange a Secret key. This Secret key is then used to do encryption. 
1. Client side encryption is via symmetric encryption method, that uses the same key for encryption and decryption followed by using the crypto.createDiffieHellman() 
2. Server side decrypt the encryption data with our private key using RSA.
3. Also trying to find a way to decrypt the encrypted data of symmetric encryption by private key still on progress. 

Used MERN Stack for faster developemnt of prototype.

Steup to set up:

1. Copy the files
2. Crete .env in the root add PORT & MONGODB_URI
3. npm install
4. npm init
5. go to client repeat 3 & 4
6. go to server repeat 3 & 4
7. npm run dev in root
8. Clien works on port 3000 and Server on 5000

![image](https://user-images.githubusercontent.com/20414225/119894182-db362a80-bf6e-11eb-8074-50d5d033843e.png)


