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

  loadEnv().then((API_KEY) => {
    console.log(`${url}${endpoint}?${urlParams}&apiKey=${API_KEY}`)

    fetch(`${url}${endpoint}?${urlParams}&apiKey=${API_KEY}`, {
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

function searchNews() {
  const termo_pesquisa = document.getElementById("filtro_principal").value;

  callApi('everything', { q: termo_pesquisa }, (data) => {
    const main_content = document.querySelector('#main_articles');

    main_content.innerHTML = '';

    data.articles.forEach((article) => {
      const card = `
      <div class="card" id="card">
            <img src="${article.urlToImage}" alt="noticia_img" class="noticia_img">
            <div class="card_text">
                <h1 class="titulo_card">${article.title}</h1>
                <p class="descricao_card">${article.description}</p>
            </div>
            <img src="./assets/estrela.svg" alt="estrela" class="estrela">
        </div>
      `;
      main_content.innerHTML += card;
    });
  });
}

window.onload = function () {
  document.getElementById("pesquisar").addEventListener("click", searchNews);
  document.getElementById("filtro_principal").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchNews();
    }
  });
}

