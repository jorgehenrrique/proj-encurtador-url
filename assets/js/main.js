import { chaves } from "../../config.js";
import {
    btnEncurtar, conf, inputEncurtar, loading,
    logo, telaAjustes, telaContainer
} from "../modules/elementos.js";
import { carregarLinks, limparMensagens } from "./tela-ajustes.js";

for (let c of conf) {
    c.onclick = () => {
        if (telaContainer.style.display === '' || telaContainer.style.display === 'flex') {
            telaAjustes.style.display = 'flex';
            telaContainer.style.display = 'none';
            carregarLinks();
        } else {
            telaContainer.style.display = 'flex';
            telaAjustes.style.display = 'none';
        }
    }
}

function exibirMensagensInicio(status, mensagem) {
    msgAjustes.innerText = mensagem;
    msgAjustes.style.display = 'flex';
    if (status) {
        msgAjustes.classList.remove('msg-erro');
    } else {
        msgAjustes.classList.add('msg-erro');
    }
}

function loadInicio(status) { // Loading
    if (status) {
        loading.style.display = 'block';
        btnEncurtar.disabled = true;
        inputEncurtar.disabled = true;
    } else {
        loading.style.display = 'none';
        btnEncurtar.disabled = false;
        inputEncurtar.disabled = false;
    }
}

btnEncurtar.onclick = () => {
    let encurtarLink = inputEncurtar.value.trim();
    if (encurtarLink.length > 4) {
        console.log('teste');
        btnEncurtar.disabled = true;
        inputEncurtar.disabled = true;
        addLink(encurtarLink);
        loadInicio(true);
    } else {
        inputEncurtar.value = `INFORME UMA URL VÁLIDA!`;
        inputEncurtar.style.backgroundColor = '#d76343d4';
        setTimeout(() => {
            inputEncurtar.style.backgroundColor = '#f6f3da'
            inputEncurtar.value = `${encurtarLink}`;
        }, 1000);
    }
};

function addLink(url) {
    const apiKey = chaves.apiKey;
    const domainUrl = chaves.domainUrl;

    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: `${apiKey}`
        },
        body: JSON.stringify({ originalURL: `${url}`, domain: `${domainUrl}` })
    };

    fetch('https://api.short.io/links', options)
        .then(response => {
            if (response.ok && response.status === 200) {
                exibirMensagensInicio(true, 'Link adicionado com sucesso!');
                setTimeout(limparMensagens, 3500);
                return response.json();
            } else { throw new Error('Resposta do servidor: ', response.status) }
        }).then(response => {
            console.log(response)
            loadInicio(false);
        }).catch(err => {
            console.error(err)
            loadInicio(false);
        });
}
