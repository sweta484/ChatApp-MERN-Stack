# ChatApp-MERN-Stack

It's example of exchanging encrypted messages between server and client using Diffie-Hellman key exchanges. Client encryption side is using Crypto Module. Server side is using Nodejs crypto and Nodejs node-rsa.

Prototype will establish a secure communication channel. This channel is used by the systems to exchange a private key. This private key is then used to do encryption between the two person. 
1. Client side encryption is via symmetric encryption method, that uses the same key for encryption and decryption i.e using the crypto.createDiffieHellman() 
2. Server side decrypt the encryption data with our private key using RSA.
3. Also trying to find a way to decrypt the encrypted data of symmetric encryption by private key but cudn't find proper method. 
