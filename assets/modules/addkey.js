import { exibirMensagensInicio } from "../js/main.js";
import { limparMensagens } from "../js/tela-ajustes.js";

const divModalKey = document.querySelector('.modail-key');
const btnModalKeySalvar = document.querySelector('.btn-key-salvar');
const btnModalKeyCancelar = document.querySelector('.btn-key-cancelar');
// inputs
const inputApiKey = document.querySelector('#api-key');
const inputApiId = document.querySelector('#api-d-id');
const inputApiUrl = document.querySelector('#api-d-url');


export function addChaves() {
  divModalKey.style.display = 'block';

  btnModalKeyCancelar.onclick = (() => {
    divModalKey.style.display = 'none';
  });
  btnModalKeySalvar.onclick = buscaChaves;
}

let keys = {};
function buscaChaves() {
  const apiKey = inputApiKey.value.trim();
  btnModalKeySalvar.disabled = true;
  btnModalKeyCancelar.disabled = true;

  if (apiKey !== '') {
    const options = {
      method: 'GET',
      headers: { accept: 'application/json', Authorization: `${apiKey}` }
    };

    fetch('https://api.short.io/api/domains', options)
      .then(response => {
        if (response.status === 200 && response.ok) {
          return response.json();
        } else {
          inputApiKey.value = `CHAVE INVÁLIDA!`;
          inputApiKey.classList.add('alerta');
          inputApiKey.classList.add('animate__shakeX');
          setTimeout(() => {
            inputApiKey.classList.remove('alerta');
            inputApiKey.classList.remove('animate__shakeX');
            inputApiKey.value = '';
            btnModalKeySalvar.disabled = false;
            btnModalKeyCancelar.disabled = false;
          }, 1000);
        }
        if (!response.ok) {
          throw new Error('Resposta do servidor: ', response.status)
        }
      }).then(response => {
        keys = { // cria objeto de chaves
          apiKey: apiKey,
          domainId: response[0].id,
          domainUrl: response[0].hostname
        };
        salvarChavesLocal(keys); // salva local
        // efeito + reload key
        setTimeout(() => {
          inputApiKey.classList.add('okay');
          inputApiKey.classList.add('animate__fadeIn');
          inputApiKey.value = `${apiKey} - OK!`;
        }, 1000);
        setTimeout(() => {
          inputApiId.classList.add('okay');
          inputApiId.classList.add('animate__fadeIn');
          inputApiId.value = `DOMAIN-ID: ${response[0].id} - OK!`;
        }, 2000);
        setTimeout(() => {
          inputApiUrl.classList.add('okay');
          inputApiUrl.classList.add('animate__fadeIn');
          inputApiUrl.value = `DOMAIN-URL: ${response[0].hostname} - OK!`;
        }, 3000);
        setTimeout(() => {
          location.reload();
        }, 4000);
        exibirMensagensInicio(true, 'Chave validada! carregando chave.');
        setTimeout(limparMensagens, 3500);
      }).catch(err => {
        exibirMensagensInicio(false, 'Chave inválida, tente novamente!');
        setTimeout(limparMensagens, 3500);
      });
  } else {
    inputApiKey.value = `INFORME UMA CHAVE VÁLIDA!`;
    inputApiKey.classList.remove('okay');
    inputApiKey.classList.remove('animate__fadeIn');
    inputApiKey.classList.add('alerta');
    inputApiKey.classList.add('animate__shakeX');
    setTimeout(() => {
      inputApiKey.classList.remove('alerta');
      inputApiKey.classList.remove('animate__shakeX');
      inputApiKey.value = '';
      btnModalKeySalvar.disabled = false;
      btnModalKeyCancelar.disabled = false;
    }, 1000);
  }
}

// salva local
function salvarChavesLocal(keys) {
  localStorage.setItem('keys', JSON.stringify(keys));
}