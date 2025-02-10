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
   * Função para chamar a API
   * @param {string} endpoint 
   * @param {Object} params 
   * @param {Function} callback 
   */
function callApi(endpoint, params, callback) {
  const url = 'https://newsapi.org/v2/';

  const urlParams = new URLSearchParams(params).toString();
  console.log(urlParams)

  loadEnv().then((API_KEY) => {
    fetch(`${url}${endpoint}`, {
      method: 'GET',
      headers: {
        'Access-control-allow-origin': '*',
        'Authorization': `Bearer ${API_KEY}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        callback(data)
      })
      .catch((error) => {
        console.error('Error:', error)
      });
  })
}

callApi('everything', { q: 'bitcoin', from: '2025-02-09', to: '2025-02-09' });