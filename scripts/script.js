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
 * @typedef {'everything' | 'top-headlines'} endPoints
 */
const DEV = true
const API_URL = 'https://newsapi.org/v2/'
const API_KEY = loadEnv()
const proxyUrl = "https://cors-anywhere.herokuapp.com/"
const url = `${proxyUrl}https://newsapi.org/v2/everything?apiKey=${API_KEY}`;
const request = new Request(url);
/**
 *
 * @param {endPoints} path
 * @returns {Promise<{message: string}|any>}
 */
const useApi = async (path) => {
    DEV && console.log(API_URL + path);
    const header = {Authorization: API_KEY}

    try {
        const response = await fetch(`${request}`);
        const jsonResponse = await response.json();

        if (response.ok) {
            return jsonResponse;
        } else {
            throw new Error(jsonResponse.message || 'Something went wrong');
        }
    } catch (err) {
        console.error(err);
        return { message:'Não foi possível se conectar com o servidor, tente novamente' }
    }
};

console.log(useApi());