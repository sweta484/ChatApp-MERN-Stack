
const path = require('path');
const fs = require('fs');
const NodeRSA = require('node-rsa');
const crypto = require('crypto');

const rsa = {}

rsa.generate = (direction) => {
    let key = new NodeRSA();
    key.generateKeyPair(2048, 65537);
    fs.writeFileSync(path.resolve(__dirname, '../keys', direction + '.private.pem'), key.exportKey('pkcs8-private-pem'));
    fs.writeFileSync(path.resolve(__dirname, '../keys', direction + '.public.pem'), key.exportKey('pkcs8-public-pem'));

    return true;
};

//rsa.generate('server');
//rsa.generate('client');

rsa.sPubkey = fs.readFileSync(path.resolve('../testapp/', 'keys', 'server.public.pem'));
rsa.sPrikey = fs.readFileSync(path.resolve('../testapp/', 'keys', 'server.private.pem'));
rsa.cPubkey = fs.readFileSync(path.resolve('../testapp/', 'keys', 'client.public.pem'));
rsa.cPrikey = fs.readFileSync(path.resolve('../testapp/', 'keys', 'client.private.pem'));


rsa.encrypt = (publicKey,message) => {
    let enc = crypto.publicEncrypt({
        key: publicKey,
        padding: crypto.RSA_PKCS1_OAEP_PADDING
    }, Buffer.from(message));

    return enc.toString('base64');
};

//console.log(rsa.cPubkey);

rsa.decrypt = (privateKey,message) => {
    let enc = crypto.privateDecrypt({
        key: privateKey,
        padding: crypto.RSA_PKCS1_OAEP_PADDING
    }, Buffer.from(message, 'base64'));

    return enc.toString();
};


// Create some sample data that we want to sign
const verifiableData = "this need to be verified"

// The signature method takes the data we want to sign, the
// hashing algorithm, and the padding scheme, and generates
// a signature in the form of bytes
signature = crypto.sign("sha256", Buffer.from(verifiableData), {
	key: rsa.sPrikey,
	padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
})

//console.log(signature.toString("base64"))

// To verify the data, we provide the same hashing algorithm and
// padding scheme we provided to generate the signature, along
// with the signature itself, the data that we want to
// verify against the signature, and the public key
isVerified = crypto.verify(
	"sha256",
	Buffer.from(verifiableData),
	{
		key: rsa.sPubkey,
		padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
	},
	signature
)

// isVerified should be `true` if the signature is valid
//console.log("signature verified: ", isVerified)

rsa.encryptChiper = (message) => {
    const KEY = crypto.randomBytes(32)
    const IV = crypto.randomBytes(16)
    const ALGORITHM = 'aes-256-gcm';
  
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
    let encrypted = cipher.update(message, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag()
  
    let output = {
      encrypted,
      KEY: KEY.toString('hex'),
      IV: IV.toString('hex'),
      TAG: tag.toString('hex'),
    }
    return output;
};

module.exports = rsa;