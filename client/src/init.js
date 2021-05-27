const crypto = require('crypto');
const rsa = {}

rsa.toBuffer = (ab) => {
  var buf = Buffer.alloc(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
      buf[i] = view[i];
  }
  return buf;
}

rsa.encrypt = ( pubkey , message ) => {
  let enc = crypto.publicEncrypt({
      key: pubkey,
      padding: crypto.RSA_PKCS1_OAEP_PADDING
  }, Buffer.from(message));

  return enc.toString('base64');
};


// rsa.encrypt = (message) => {
//     const KEY = crypto.randomBytes(32)
//     const IV = crypto.randomBytes(16)
//     const ALGORITHM = 'aes-256-gcm';
  
//     const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
//     let encrypted = cipher.update(message, 'utf8', 'hex');
//     encrypted += cipher.final('hex');
//     const tag = cipher.getAuthTag()
  
//     let output = {
//       encrypted,
//       KEY: KEY.toString('hex'),
//       IV: IV.toString('hex'),
//       TAG: tag.toString('hex'),
//     }
//     return output;
// };

rsa.hexStringToArrayBuffer = (hexString) => {
    hexString = hexString.replace(/^0x/, '');
    if (hexString.length % 2 !== 0) {
      console.log('WARNING: expecting an even number of characters in the hexString');
    }
    var bad = hexString.match(/[G-Z\s]/i);
    if (bad) {
        console.log('WARNING: found non-hex characters', bad);    
    }
    var pairs = hexString.match(/[\dA-F]{2}/gi);
    var integers = pairs.map(function(s) {
        return parseInt(s, 16);
    });
    var array = new Uint8Array(integers);
    return array.buffer;
  }

rsa.decrypt = (data) => {
    let KEY = rsa.hexStringToArrayBuffer(data.KEY);
    let IV = rsa.hexStringToArrayBuffer(data.IV);
    let encrypted = rsa.hexStringToArrayBuffer(data.encrypted + data.TAG);
    //console.log(data.TAG);

    window.crypto.subtle.importKey('raw', KEY, 'AES-GCM', true, ['decrypt']).then((importedKey)=>{
      //console.log('importedKey: ', importedKey);
      window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: IV,
        },
        importedKey,
        encrypted
      ).then((decodedBuffer)=>{
        //let plaintext = new TextDecoder('utf8').decode(decodedBuffer);
        //console.log(plaintext); 
      })
   });
} 


module.exports = rsa;