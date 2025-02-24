import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';



/**
 * Encrypts a message using the sender's private key and the recipient's public key.
 *
 * @param {String} message - The message to be encrypted.
 * @param {Uint8Array} senderPrivateKey - The private key of the sender.
 * @param {Uint8Array} recipientPublicKey - The public key of the recipient.
 * @returns {Object} An object containing the nonce and the ciphertext of the encrypted message.
 */

export function encryptMessage(message, senderPrivateKey, recipientPublicKey) {

  // const keyPair = nacl.box.keyPair();
  // const publicKey = naclUtil.encodeBase64(keyPair.publicKey);
  // const privateKey = naclUtil.encodeBase64(keyPair.secretKey);

  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const messageUint8 = naclUtil.decodeUTF8(message);
  const encrypted = nacl.box(messageUint8, nonce, recipientPublicKey, senderPrivateKey);
  return {
    nonce: naclUtil.encodeBase64(nonce),
    ciphertext: naclUtil.encodeBase64(encrypted)
  };
}

/**
 * Decrypts an encrypted message object using a recipient private key and sender public key.
 *
 * @param {Object} encryptedObject - Contains the nonce and ciphertext of the encrypted message.
 * @param {String} recipientPrivateKey - The private key of the recipient that will decrypt the message.
 * @param {String} senderPublicKey - The public key of the sender that the message was encrypted with.
 * @returns {String} The decrypted message.
 * @throws {Error} If the message could not be decrypted.
 */
export function decryptMessage(encryptedObject, recipientPrivateKey, senderPublicKey) {
  const nonce = naclUtil.decodeBase64(encryptedObject.nonce);
  const ciphertext = naclUtil.decodeBase64(encryptedObject.ciphertext);
  const decrypted = nacl.box.open(ciphertext, nonce, senderPublicKey, recipientPrivateKey);
  if (!decrypted) {
    throw new Error("Could not decrypt message.");
  }
  return naclUtil.encodeUTF8(decrypted);
}
