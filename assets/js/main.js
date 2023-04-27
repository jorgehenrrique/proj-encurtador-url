import { chaves } from "../../config.js";
import {
    aLink,
    btnCompartilhar,
    btnCopiar,
    btnEncurtar, btnEncurtarL, btnQr, conf, containerLoader, divBtnInteracao, divLinkCurto, divRedeWhatsCom, divRedes, inputEncurtar, loading,
    logo, msgInicio, redeLinkd, redeTwitt, redeWhats, smallData, telaAjustes, telaContainer
} from "../modules/elementos.js";
import { carregarLinks, formataData, limparMensagens } from "./tela-ajustes.js";

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
    msgInicio.innerText = mensagem;
    msgInicio.style.display = 'flex';
    if (status) {
        msgInicio.classList.remove('msg-erro');
    } else {
        msgInicio.classList.add('msg-erro');
    }
}

function loadInicio(status) { // Loading
    if (status) {
        containerLoader.style.display = 'flex';
        loading.style.display = 'block';
        btnEncurtar.disabled = true;
        inputEncurtar.disabled = true;
        btnEncurtarL.disabled = true;
    } else {
        loading.style.display = 'none';
        btnEncurtar.disabled = false;
        inputEncurtar.disabled = false;
        btnEncurtarL.disabled = false;
    }
}

btnEncurtarL.onclick = () => {
    verificaEntrada();
};

btnEncurtar.onclick = () => verificaEntrada();

function verificaEntrada() {
    loadInicio(true);
    let encurtarLink = inputEncurtar.value.trim();
    if (encurtarLink.length > 4) {
        addLink(encurtarLink);
    } else {
        inputEncurtar.value = `INFORME UM URL VÁLIDO!`;
        inputEncurtar.style.backgroundColor = '#d76343d4';
        setTimeout(() => {
            inputEncurtar.style.backgroundColor = '#f6f3da'
            inputEncurtar.value = `${encurtarLink}`;
            loadInicio(false);
        }, 1000);
    }
}

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
                return response.json();
            } else if (response.status === 201) {
                console.log('pegar qr code')
            } else { throw new Error('Resposta do servidor: ', response.status) }
        }).then(response => {
            console.log(response)//////////
            if (response.duplicate) {
                exibirMensagensInicio(false, 'Link informado já existe!');
                setTimeout(limparMensagens, 3500);
            } else {
                exibirMensagensInicio(true, 'Link adicionado com sucesso!');
                setTimeout(limparMensagens, 3500);
                // console.log(response.shortURL);/////////
                compartilharLinks(response.shortURL, response.createdAt);
            }
            loadInicio(false);
        }).catch(err => {
            console.error(err)
            loadInicio(false);
            exibirMensagensInicio(false, 'Ocorreu um erro, tente novamente!');
            setTimeout(limparMensagens, 3500);
        });
}

function compartilharLinks(linkCurto, data) {
    let criacao = formataData(data);
    // console.log(linkCurto); ///
    btnEncurtar.style.display = 'none';
    btnEncurtarL.style.display = 'block';
    divLinkCurto.style.display = 'flex';

    aLink.innerText = `${linkCurto}`;
    aLink.href = `${linkCurto}`;
    smallData.innerHTML = `Link criado em: ${criacao.date} às ${criacao.time}`;
    containerLoader.style.display = 'none';

    divBtnInteracao.style.display = 'flex'; // botoes de copiar compartilhar e qr

    btnCopiar.onclick = copiaLink; // Copiar link
    btnCompartilhar.onclick = compartilharLink; // Compartilhar nas redes
    btnQr.onclick = receberQrCode; // Qr code
}

function copiaLink() {
    divRedes.style.display = 'none';
    divRedeWhatsCom.style.display = 'none';

    navigator.clipboard.writeText(aLink.href);
    exibirMensagensInicio(true, 'Link copiado com sucesso!');
    setTimeout(limparMensagens, 3500);
}

function compartilharLink() {
    divRedes.style.display = 'flex'; // as 3 redes sociais botoes
    redeWhats.onclick = 'onClick'; // https://api.whatsapp.com/send?phone=5564999886607
    redeLinkd.onclick = 'onClick';
    redeTwitt.onclick = 'onClick';
}

function receberQrCode() {

}