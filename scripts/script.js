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
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg">
              <path class="estrela"
                d="M14.9993 24.3017L7.72816 28.6819C7.40695 28.8863 7.07114 28.9739 6.72072 28.9447C6.37031 28.9155 6.0637 28.7987 5.80089 28.5943C5.53808 28.3899 5.33367 28.1346 5.18766 27.8286C5.04166 27.5226 5.01245 27.1792 5.10006 26.7984L7.02734 18.5199L0.588478 12.957C0.296466 12.6942 0.114251 12.3946 0.0418321 12.0582C-0.0305868 11.7218 -0.00897807 11.3936 0.106659 11.0736C0.222295 10.7535 0.397502 10.4907 0.63228 10.2851C0.867057 10.0796 1.18827 9.94816 1.59592 9.89092L10.0935 9.14629L13.3786 1.34958C13.5246 0.999168 13.7512 0.736357 14.0584 0.56115C14.3656 0.385943 14.6792 0.29834 14.9993 0.29834C15.3193 0.29834 15.6329 0.385943 15.9401 0.56115C16.2473 0.736357 16.4739 0.999168 16.6199 1.34958L19.9051 9.14629L28.4026 9.89092C28.8114 9.94933 29.1326 10.0807 29.3662 10.2851C29.5998 10.4895 29.775 10.7524 29.8918 11.0736C30.0087 11.3948 30.0308 11.7236 29.9584 12.06C29.886 12.3964 29.7032 12.6954 29.41 12.957L22.9712 18.5199L24.8985 26.7984C24.9861 27.178 24.9569 27.5214 24.8109 27.8286C24.6648 28.1358 24.4604 28.391 24.1976 28.5943C23.9348 28.7975 23.6282 28.9143 23.2778 28.9447C22.9274 28.9751 22.5916 28.8875 22.2703 28.6819L14.9993 24.3017Z" />
            </svg>
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

/**
 * retorna se noticia já esta salva nos favoritos
 * @param {string} hash 
 * @returns {boolean}
 */
function isFavorito(hash){
  if(localStorage.getItem(hash))return true
  return false
}

/**
 * Salva a noticia no local storage do browser
 * @param {object} object 
 * @returns 
 */
function salvarFavorito(object){
  if(!object) return

  const hash = generateHash(JSON.stringify(object))

  if(isFavorito(hash))return

  localStorage.setItem(hash, object)
}