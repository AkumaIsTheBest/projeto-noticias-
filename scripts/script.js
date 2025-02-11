/**
 * Retorna a chave de api
 * @returns {string} chave de api para API_KEY
 */
async function loadEnv() {
    try {
      const response = await fetch('./env.json');
      if (!response.ok) {
        throw new Error('Failed to load .env file');
      }

      const responseJson = await response.json();
      const { API_KEY } =  responseJson
      return API_KEY

    } catch (error) {
      console.error('Error loading .env file:', error);
    }
  }

/**
 * Retorna a hash sha-1 da string dada
 * @param {string} value Valor que deseja obter hash
 */
async function generateHash(value) {
  var crypto = window.crypto;
  var buffer = await str2ab(value);
  var hash_bytes = await crypto.subtle.digest("SHA-1", buffer);
  return [...new Uint8Array(hash_bytes)].map(x => x.toString(16).padStart(2, '0')).join('')
}

// https://stackoverflow.com/a/11058858
function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

