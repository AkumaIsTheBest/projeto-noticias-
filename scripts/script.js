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

  getInfoFromApi('everything', { q: termo_pesquisa });
}

function getInfoFromApi(endpoint, params){
  callApi(endpoint, params, (data) => {
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

function getTopHeadlines() {
  const termo_pesquisa = document.getElementById("filtro_principal").value;

  if(termo_pesquisa == ''){
    getInfoFromApi('top-headlines', { country: 'us' });
    return;
  }

  getInfoFromApi('top-headlines', { country: 'us', q: termo_pesquisa });

}

window.onload = function () {
  if(window.location.pathname == '/hot.html'){
    getTopHeadlines();

    document.getElementById("pesquisar").addEventListener("click", getTopHeadlines());
    document.getElementById("filtro_principal").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        getTopHeadlines();
      }
    });
    return;
  }
  
  document.getElementById("pesquisar").addEventListener("click", searchNews);
  document.getElementById("filtro_principal").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchNews();
    }
  });
}

