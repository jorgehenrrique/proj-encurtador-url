import { chaves } from "../../config.js";
import {
    aLink,
    btnCompartilhar,
    btnCopiar,
    btnEncurtar, btnEncurtarL, btnQr, conf, containerLoader, divBtnInteracao, divLinkCurto, divQrCode, divRedeWhatsCom, divRedes, inputEncurtar, loading,
    logo, msgInicio, qrDownload, qrImg, redeLinkd, redeTwitt, redeWhats, smallData, telaAjustes, telaContainer
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
        // containerLoader.style.display = 'flex';
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
    divQrCode.style.display = 'none';
    divRedes.style.display = 'none';
    divRedeWhatsCom.style.display = 'none';
    // divBtnInteracao.style.display = 'none';
    verificaEntrada();
};

btnEncurtar.onclick = () => verificaEntrada();

function verificaEntrada() {
    loadInicio(true);
    let encurtarLink = inputEncurtar.value.trim();
    if (encurtarLink.length > 4) {
        inputEncurtar.value = '';
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
            } else { throw new Error('Resposta do servidor: ', response.status) }
        }).then(response => {
            // console.log(response)//////////
            if (response.duplicate) {
                exibirMensagensInicio(false, 'Link informado já existe!');
                setTimeout(limparMensagens, 3500);
                containerLoader.style.display = 'flex';
                btnEncurtar.style.display = 'block';
                btnEncurtarL.style.display = 'none';
                divLinkCurto.style.display = 'none';
                divBtnInteracao.style.display = 'none';
            } else {
                exibirMensagensInicio(true, 'Link adicionado com sucesso!');
                setTimeout(limparMensagens, 3500);
                compartilharLinks(response.shortURL, response.createdAt, response.idString);
            }
            loadInicio(false);
        }).catch(err => {
            console.error(err)
            loadInicio(false);
            exibirMensagensInicio(false, 'Ocorreu um erro, tente novamente!');
            setTimeout(limparMensagens, 3500);
            containerLoader.style.display = 'flex';
            btnEncurtar.style.display = 'block';
            btnEncurtarL.style.display = 'none';
            divLinkCurto.style.display = 'none';
            divBtnInteracao.style.display = 'none';
        });
}

function compartilharLinks(linkCurto, data, linkId) {
    let criacao = formataData(data);
    btnEncurtar.style.display = 'none'; // tira btn principal
    btnEncurtarL.style.display = 'block'; // add btn secundário
    divLinkCurto.style.display = 'flex';  // exibe url criado

    aLink.innerText = `${linkCurto}`;
    aLink.href = `${linkCurto}`;
    smallData.innerHTML = `Link criado em: ${criacao.date} às ${criacao.time}`;
    containerLoader.style.display = 'none'; // container do loader

    divBtnInteracao.style.display = 'flex'; // exibe botoes de copiar compartilhar e qr

    btnCopiar.onclick = copiaLink; // Copiar link
    btnCompartilhar.onclick = (() => compartilharLink(linkCurto)); // Compartilhar nas redes
    btnQr.onclick = (() => receberQrCode(linkId)); // Qr code
}

// || Copiar link para area de tranferencia
function copiaLink() {
    divRedes.style.display = 'none';
    divQrCode.style.display = 'none';
    divRedeWhatsCom.style.display = 'none';

    navigator.clipboard.writeText(aLink.href); // copiado
    exibirMensagensInicio(true, 'Link copiado com sucesso!');
    setTimeout(limparMensagens, 3500);
}

function compartilharLink(linkCurto) { // Chama compartilhar nas redes sociais
    divQrCode.style.display = 'none'; // qr code

    divRedes.style.display = 'flex'; // as 3 redes sociais botoes
    redeWhats.onclick = compartilharViaWhatsApp(linkCurto);
    redeLinkd.onclick = 'onClick';
    redeTwitt.onclick = 'onClick';
}

function compartilharViaWhatsApp(url) {
    // https://api.whatsapp.com/send?phone=5564999886607
    divRedeWhatsCom.style.display = 'flex';

    
}







// || Compartilhar QR Code
function receberQrCode(linkId) {
    loadInicio(true); // iniciar loading
    divQrCode.style.display = 'flex';
    divRedes.style.display = 'none';
    divRedeWhatsCom.style.display = 'none';

    buscarQrCode(linkId)
    function buscarQrCode() {
        const apiKey = chaves.apiKey;
        const options = {
            method: 'POST',
            headers: {
                accept: 'image/png',
                'content-type': 'application/json',
                Authorization: `${apiKey}`
            },
            body: JSON.stringify({ type: 'png' })
        };

        fetch(`https://api.short.io/links/qr/${linkId}`, options)
            .then(response => {
                return response.blob();
            }).then(response => {
                const imageUrl = URL.createObjectURL(response);
                qrImg.src = imageUrl;
                qrDownload.href = imageUrl;
                divQrCode.style.display = 'flex';
                loadInicio(false); // finalizar loading
                exibirMensagensInicio(true, 'QR Code criado com sucesso!');
                setTimeout(limparMensagens, 3500);
            }).catch(err => {
                console.error(err)
                loadInicio(false); // finalizar loading
                exibirMensagensInicio(false, 'Ocorreu um erro, tente novamente!');
                setTimeout(limparMensagens, 3500);
                containerLoader.style.display = 'flex';
                btnEncurtar.style.display = 'block';
                btnEncurtarL.style.display = 'none';
                divLinkCurto.style.display = 'none';
            });
    }
}