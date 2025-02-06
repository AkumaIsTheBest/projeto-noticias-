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
      console.log(responseJson)


    } catch (error) {
      console.error('Error loading .env file:', error);
    }
  }

  loadEnv();
