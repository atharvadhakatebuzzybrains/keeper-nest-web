import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'K3ep3rN3st!2024@Secure#App$Key%32Char';
export const encrypt = (text) => {
  try {
    console.log("Encrypting text...");
    
    if (!text) {
      console.error("No text provided for encryption");
      return null;
    }
    
    const encrypted = CryptoJS.AES.encrypt(
      text.toString(),
      ENCRYPTION_KEY,
      {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    
    const result = encrypted.toString();
    console.log("Encryption successful");
    return result;
    
  } catch (error) {
    console.error("Encryption error:", error);
    return null;
  }
};

export const decrypt = (encryptedText: string) => {
  try {
    console.log("Decrypting text...");
    
    if (!encryptedText) {
      console.error("No encrypted text provided");
      return null;
    }
    
    const decrypted = CryptoJS.AES.decrypt(
      encryptedText,
      ENCRYPTION_KEY,
      {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    
    const result = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!result) {
      console.error('Empty decryption result');
      return null;
    }
    
    console.log("Decryption successful");
    return result;
    
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
};

export const encryptWithIV = (text: string) => {
  try {
    const iv = CryptoJS.lib.WordArray.random(16);
    
    const encrypted = CryptoJS.AES.encrypt(
      text,
      CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)),
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    
    const result = iv.toString() + encrypted.toString();
    return result;
    
  } catch (error) {
    console.error("Encryption with IV error:", error);
    return null;
  }
};

export const decryptWithIV = (encryptedData: string) => {
  try {
    // Extract IV (first 32 characters hex = 16 bytes)
    const iv = CryptoJS.enc.Hex.parse(encryptedData.substr(0, 32));
    const encryptedText = encryptedData.substr(32);
    
    const decrypted = CryptoJS.AES.decrypt(
      encryptedText,
      CryptoJS.enc.Utf8.parse(ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32)),
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    
    return decrypted.toString(CryptoJS.enc.Utf8);
    
  } catch (error) {
    console.error("Decryption with IV error:", error);
    return null;
  }
};