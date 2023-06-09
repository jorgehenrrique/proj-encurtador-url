import { chaves } from "../../config.js";
import { addChaves } from "../modules/addkey.js";
import {
    aLink, btnCompartilhar, btnCopiar, btnEncurtar, btnEncurtarL, btnQr,
    btnRedeWhats, chave, conf, containerLoader, divBtnInteracao, divLinkCurto,
    divQrCode, divRedeWhatsCom, divRedes, inputEncurtar, inputRedeWhats,
    loading, msgInicio, qrDownload, qrDownloadModal, qrImg, qrImgModal, redeFace, redeLinkd, redeTwitt,
    redeWhats, smallData, telaAjustes, telaContainer
} from "../modules/elementos.js";
import { carregarLinks, formataData, limparMensagens } from "./tela-ajustes.js";

chave.addEventListener('click', addChaves); // Modal de add api-key

for (let tela of conf) {
    tela.onclick = () => {
        if (telaContainer.style.display === '' || telaContainer.style.display === 'flex') {
            telaAjustes.style.display = 'flex';
            telaContainer.style.display = 'none';
            carregarLinks();
        } else {
            telaContainer.style.display = 'flex';
            telaAjustes.style.display = 'none';
            divQrCode.style.display = 'none';
        }
    }
}

export function exibirMensagensInicio(status, mensagem) {
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
    verificaEntrada();
};

(() => { // Altera o placeholder
    setTimeout(() => {
        inputEncurtar.placeholder = 'URL A SER ENCURTADA';
    }, 5000);
})()

btnEncurtar.onclick = () => verificaEntrada();

function verificaEntrada() {
    loadInicio(true);
    let encurtarLink = inputEncurtar.value.trim();
    if (encurtarLink.length > 8 && isNaN(encurtarLink) &&
        !(encurtarLink.includes(',')) && encurtarLink.includes('.')) {
        addLink(encurtarLink);
    } else {
        inputEncurtar.value = `INFORME UMA URL VÁLIDA!`;
        inputEncurtar.classList.add('alerta');
        inputEncurtar.classList.add('animate__shakeX');
        setTimeout(() => {
            inputEncurtar.classList.remove('alerta');
            inputEncurtar.classList.remove('animate__shakeX');
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
            if (response.duplicate) {
                exibirMensagensInicio(false, 'Link informado já existe!');
                setTimeout(limparMensagens, 3500);
                containerLoader.style.display = 'flex';
                btnEncurtar.style.display = 'block';
                btnEncurtarL.style.display = 'none';
                divLinkCurto.style.display = 'none';
                divBtnInteracao.style.display = 'none';
            } else {
                inputEncurtar.value = ''; // Limpa input, se ok
                exibirMensagensInicio(true, 'Link criado com sucesso!');
                setTimeout(limparMensagens, 3500);
                compartilharLinks(response.shortURL, response.createdAt, response.idString);
            }
            loadInicio(false);
        }).catch(err => {
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
    divBtnInteracao.style.display = 'flex'; // exibe botoes de copiar, compartilhar e qr

    btnCopiar.onclick = copiaLink; // Copiar link
    btnCompartilhar.onclick = (() => compartilharLink(linkCurto)); // Compartilhar nas redes
    btnQr.onclick = (() => receberQrCode(linkId)); // Qr code
}

// || Copiar link para area de tranferencia
function copiaLink() {
    navigator.clipboard.writeText(aLink.href); // copiado
    exibirMensagensInicio(true, 'Link copiado com sucesso!');
    setTimeout(limparMensagens, 3500);
}

function compartilharLink(linkCurto) { // chama compartilhar nas redes sociais
    divQrCode.style.display = 'none'; // qr code
    divRedes.style.display = 'flex'; // redes sociais botoes

    redeWhats.onclick = (() => compartilharViaWhatsApp(linkCurto));

    redeLinkd.onclick = (() => {
        let urlLink = `https://www.linkedin.com/sharing/share-offsite/?url=${linkCurto}`;
        window.open(urlLink);
        exibirMensagensInicio(true, 'Link enviado para o LinkedIn com sucesso!');
        setTimeout(limparMensagens, 4000);
    });

    redeTwitt.onclick = (() => {
        let urlLink = `https://twitter.com/intent/tweet?url=${linkCurto}`;
        window.open(urlLink);
        exibirMensagensInicio(true, 'Link enviado para o Twitter com sucesso!');
        setTimeout(limparMensagens, 4000);
    });

    redeFace.onclick = (() => {
        let urlLinkF = `https://www.facebook.com/sharer.php?u=${linkCurto}`;
        window.open(urlLinkF);
        exibirMensagensInicio(true, 'Link enviado para o Facebook com sucesso!');
        setTimeout(limparMensagens, 4000);
    });
}

function compartilharViaWhatsApp(url) {
    divRedeWhatsCom.style.display = 'flex';

    function desabilitaEntradasWhats(ok) {
        if (ok) {
            inputRedeWhats.disabled = true;
            btnRedeWhats.disabled = true;
        } else {
            inputRedeWhats.disabled = false;
            btnRedeWhats.disabled = false;
        }
    }

    btnRedeWhats.addEventListener('click', () => {
        desabilitaEntradasWhats(true);
        let numWhats = inputRedeWhats.value.trim();
        if (!isNaN(numWhats) && numWhats.length >= 10) {
            numWhats = '55' + numWhats;
            const link = `https://api.whatsapp.com/send?phone=${numWhats}&text=${url}`;
            window.open(link, "_blank");
            desabilitaEntradasWhats(false);

            exibirMensagensInicio(true, 'Link compartilhado com WhatsApp com sucesso!');
            setTimeout(limparMensagens, 4000);
        } else {
            inputRedeWhats.value = `NÚMERO INVÁLIDO!`;
            inputRedeWhats.classList.add('alerta');
            inputRedeWhats.classList.add('animate__shakeX');
            setTimeout(() => {
                inputRedeWhats.classList.remove('alerta');
                inputRedeWhats.classList.remove('animate__shakeX');
                inputRedeWhats.value = ``;
                desabilitaEntradasWhats(false);
            }, 1500);
        }
    })
}


// || Compartilhar QR Code
export function receberQrCode(linkId) {
    loadInicio(true); // iniciar loading
    divQrCode.style.display = 'flex';
    divRedes.style.display = 'none';
    divRedeWhatsCom.style.display = 'none';

    buscarQrCode(linkId);
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
                if (response.status === 201) {
                    return response.blob();
                } else if (response.status === 404) {
                    throw new Error('URL selecionado não existe mais!');
                }
            }).then(response => {
                const imageUrl = URL.createObjectURL(response);
                qrImg.src = imageUrl;
                qrDownload.href = imageUrl;
                // Modal ajustes
                qrImgModal.src = imageUrl;
                qrDownloadModal.href = imageUrl;
                // 
                loadInicio(false); // finalizar loading
                exibirMensagensInicio(true, 'QR Code criado com sucesso!');
                setTimeout(limparMensagens, 3500);
                loadInicio(false); // finalizar loading
            }).catch(err => {
                exibirMensagensInicio(false, `${err.message}`);
                setTimeout(limparMensagens, 3500);
                containerLoader.style.display = 'flex';
                btnEncurtar.style.display = 'block';
                divBtnInteracao.style.display = 'none';
                divQrCode.style.display = 'none';
                btnEncurtarL.style.display = 'none';
                divLinkCurto.style.display = 'none';
                loadInicio(false); // finalizar loading
            });
    }
}


// Checa se há chaves salvas, e mostra os avisos
(() => {
    const key = chaves;
    if (key.apiKey === '' && key.domainId === '' && key.domainUrl === '') {
        exibirMensagensInicio(false, 'Insira sua chave de API, para gerenciar suas URLs!');
        setTimeout(limparMensagens, 4000);
        setTimeout(() => {
            exibirMensagensInicio(true, 'Obtenha sua chave no endereço: short.io');
            setTimeout(limparMensagens, 4000);
        }, 4100);
    } else {
        exibirMensagensInicio(true, 'Chaves de API carregadas!');
        setTimeout(limparMensagens, 3500);
    }
})()