// fetch('config.json')
//     .then(response => response.json())
//     .then(data => {
//         const apiKey = data.apiKey;
//         const domainId = data.domainId;
//         // console.log(apiKey, domainId);
//         requestKey(data);
//     })
//     .catch(error => console.error('Erro ao buscar config.json:', error));


// function requestKey(env) {
    //     console.log(env.apiKey)
    //     console.log(env.domainId)
    // }
    
import { btnEncurtar, inputEncurtar, loading, logo } from "./assets/modules/elementos.js";
import requestKey from "./assets/modules/requestKey.js";
// requestKey()

logo.onclick = () => { 
    console.log('deu certo')
    }
btnEncurtar.onclick = () => {
    let encurtarLink = inputEncurtar.value.trim();
    if (encurtarLink.length !== 0) {
        console.log('teste');
        btnEncurtar.disabled = true;
        inputEncurtar.disabled = true;
        loading.style.display = 'block';
        setTimeout(() => {
        btnEncurtar.disabled = false;
        inputEncurtar.disabled = false;
        loading.style.display = 'none';
        }, 2000);
    }
};