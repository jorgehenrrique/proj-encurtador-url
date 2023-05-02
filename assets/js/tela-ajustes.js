import { chaves } from "../../config.js";
import {
    divModais, divModalBoo, divModalBooP, divModalEditar,
    modalBtnNao, modalBtnSim, telaAjustes, telaContainer,
    logo, loading, dominio, listaLinks, divModalEditarP,
    fecharModal, inputPath, inputUrl, btnSalvarEdit,
    msgAjustes, formularios, loadingCAjustes, msgInicio,
    divQrCode, divRedeWhatsCom, divRedes, containerLoader,
    btnEncurtar, btnEncurtarL, divLinkCurto, divBtnInteracao, inputTitulo,
} from "../modules/elementos.js";
import { receberQrCode } from "./main.js";

// || Prevenir envios de formulario
formularios.forEach(form => form.addEventListener('submit', e => e.preventDefault()));

function exibirMensagens(status, mensagem) {
    msgAjustes.innerText = mensagem;
    msgAjustes.style.display = 'flex';
    if (status) {
        msgAjustes.classList.remove('msg-erro');
    } else {
        msgAjustes.classList.add('msg-erro');
    }
}

export function limparMensagens() {
    msgAjustes.style.display = 'none';
    msgInicio.style.display = 'none';
}

function trocaTela(status) { // Sai dos ajustes e modal
    if (status) {
        telaContainer.style.display = 'flex';
        telaAjustes.style.display = 'none';
        divModais.style.display = 'none';
        divModalBoo.style.display = 'none';
        divModalEditar.style.display = 'none';
        // Alteracoes na tela inicial
        divQrCode.style.display = 'none';
        divRedes.style.display = 'none';
        divRedeWhatsCom.style.display = 'none';
        containerLoader.style.display = 'flex';
        btnEncurtar.style.display = 'block';
        btnEncurtarL.style.display = 'none';
        divLinkCurto.style.display = 'none';
        divBtnInteracao.style.display = 'none';
    } else {
        divModais.style.display = 'none';
        divModalBoo.style.display = 'none';
        divModalEditar.style.display = 'none';
    }
}

function loadAjustes(status) { // Loading
    if (status) {
        loadingCAjustes.style.display = 'flex';
    } else {
        loadingCAjustes.style.display = 'none';
    }
}

logo.onclick = () => { // Clique na logo
    divModais.style.display = 'block';
    divModalBoo.style.display = 'block';
    divModalBooP.innerText = 'Deseja voltar à tela inicial?';

    modalBtnNao.addEventListener('click', () => trocaTela(false));
    modalBtnSim.onclick = (() => trocaTela(true));
}

export function carregarLinks() { // Recolher keys
    const apiKey = chaves.apiKey;
    const domainId = chaves.domainId;
    solicitaAcesso(apiKey, domainId);
}

function solicitaAcesso(apiKey, domainId) { // Acessar api de links
    loadAjustes(true); // loading inicia
    const options = {
        method: 'GET',
        headers: { accept: 'application/json', Authorization: `${apiKey}` }
    };

    fetch(`https://api.short.io/api/links?domain_id=${domainId}&limit=30&dateSortOrder=desc`, options)
        .then(response => {
            if (response.ok && response.status === 200) {
                return response.json();
            } else { throw new Error('Resposta do servidor: ', response.status) }
        }).then(data => {
            listaLinks.innerHTML = `<tr>
                <td colspan="4">Nenhum link disponível</td>
                </tr>`;
            if (data.links.length <= 0) {
                exibirMensagens(false, 'Não há URLs criadas ainda! ');
                setTimeout(limparMensagens, 3500);
                loadAjustes(false);
                return;
            }
            if (data.links.length == 1) {
                exibirMensagens(true, 'URL disponível listada!');
                setTimeout(limparMensagens, 3500);
            }
            if (data.links.length > 1) {
                exibirMensagens(true, 'URLs disponíveis listadas!');
                setTimeout(limparMensagens, 3500);
            }
            montaTabela(data.links);
        }).catch(err => {
            console.error(err)
            exibirMensagens(false, 'Serviço indisponível!');
            setTimeout(limparMensagens, 3500);
            loadAjustes(false); // loading termina
        });
}


// || Monta batela de links
function montaTabela(dados) {
    let dominios = dados[0].shortURL.split('//');
    dominios = dominios[1].split('/');
    dominios = dominios[0];

    dominio.innerHTML = `Domínio: <a href="https://short.io/pt" target="_blank">${dominios}</a>`;
    listaLinks.innerHTML = '';

    loadAjustes(false); // loading termina
    dados.forEach(element => {
        let time = formataData(element.createdAt);

        listaLinks.innerHTML += `<tr>
        <td>${element.shortURL}</td>
        <td>${element.originalURL}</td>
        <td>${time.date} às ${time.time}</td>
        <td><img src="assets/icon/conf/edit.png" class="icon-conf edit-icon" style="width: 20px;" id-string="${element.idString}" lin="${element.shortURL}" lin2="${element.originalURL}" tit="${element.title}"> <img src="assets/icon/conf/del.png" class="icon-conf delete-icon" style="width: 20px;" id-string="${element.idString}" lin="${element.shortURL}"></td>
    </tr>`
        montarEventos();
    });

};

// || Formata data
export function formataData(dateTime) {
    const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

    const formattedDate = new Date(dateTime).toLocaleDateString('pt-BR', optionsDate);
    const formattedTime = new Date(dateTime).toLocaleTimeString('pt-BR', optionsTime);
    return { date: formattedDate, time: formattedTime };
}


// || Chama editar ou excluir links
function montarEventos() {
    const editIcon = document.querySelectorAll('.edit-icon');
    const deletIcon = document.querySelectorAll('.delete-icon');

    editIcon.forEach(icon => {
        icon.addEventListener('click', () => {
            const idString = icon.getAttribute('id-string');
            const link = icon.getAttribute('lin');
            const linkOriginal = icon.getAttribute('lin2');
            const titulo = icon.getAttribute('tit');
            editarLink(idString, link, linkOriginal, titulo);
        });
    });

    deletIcon.forEach(icon => {
        icon.addEventListener('click', () => {
            const idString = icon.getAttribute('id-string');
            const link = icon.getAttribute('lin');
            excluirLink(idString, link);
        });
    });
};

function editarLink(linkId, link, linkOriginal, titulo) { // Modal editar link
    divModais.style.display = 'block';
    divModalEditar.style.display = 'block';
    divModalEditarP.innerText = `Editando: ${link}`;

    fecharModal.addEventListener('click', () => trocaTela(false));
    tratarEdicao(linkId, link, linkOriginal, titulo);
}

function excluirLink(linkId, link) { // Modal confirma excluir link
    divModais.style.display = 'block';
    divModalBoo.style.display = 'block';
    divModalBooP.innerText = `Deseja excluir o link: ${link}`;

    modalBtnNao.addEventListener('click', () => trocaTela(false));
    modalBtnSim.onclick = (() => deletarLink(linkId));
}


// || Delete link
function deletarLink(linkId) {
    loadAjustes(true); // loading inicia
    const apiKey = chaves.apiKey;
    const options = { method: 'DELETE', headers: { Authorization: `${apiKey}` } };

    fetch(`https://api.short.io/links/${linkId}`, options)
        .then(response => {
            if (response.ok && response.status === 200) {
                exibirMensagens(true, 'Link deletado com sucesso!');
                setTimeout(limparMensagens, 3500);
                return response.json();
            } else if (response.status === 404) {
                console.warn('EDITANDO LINKS RÁPIDO DEMAIS, ALERTA DE AVISO DA API');
                setTimeout(() => location.reload(), 10000);
            } else { console.error('Resposta do servidor: ', response.status) }
        }).then(response => {
            trocaTela(false);
            carregarLinks();
        }).catch(err => {
            console.error(err)
            trocaTela(false);
            loadAjustes(false);
            exibirMensagens(false, 'Ocorreu um erro, tente novamente!');
            setTimeout(limparMensagens, 3500);
        });
}


// || Editar link
function tratarEdicao(linkId, link, linkOriginal, titulo) {
    receberQrCode(linkId);
    let slug = link.split('/');
    slug = slug[3];

    inputPath.value = `${slug}`;
    inputUrl.value = `${linkOriginal}`;
    inputTitulo.value = `${titulo}`;
    if (titulo === 'undefined') {
        inputTitulo.value = 'Sem título';
    } else {
        inputTitulo.value = `${titulo}`;
    }

    btnSalvarEdit.onclick = (() => {
        bloqueiaEdicao(true);
        if (inputPath.value.trim().length === slug.length && inputUrl.value.trim().length > 6) {
            loadAjustes(true); // loading inicia
            slug = inputPath.value.trim();
            linkOriginal = inputUrl.value.trim();
            titulo = inputTitulo.value.trim();

            const apiKey = chaves.apiKey;
            const options = {
                method: 'POST',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    Authorization: `${apiKey}`
                },
                body: JSON.stringify({ originalURL: `${linkOriginal}`, path: `${slug}`, title: `${titulo}` })
            };

            fetch(`https://api.short.io/links/${linkId}`, options)
                .then(response => {
                    if (response.ok && response.status === 200) {
                        exibirMensagens(true, 'Link editado com sucesso!');
                        setTimeout(limparMensagens, 3500);
                        return response.json();
                    } else if (response.status === 400) {
                        console.warn('DELETANDO LINKS RÁPIDO DEMAIS, ALERTA DE AVISO DA API');
                        setTimeout(() => location.reload(), 10000);
                    } else { console.error('Resposta do servidor: ', response.status) }
                }).then(response => {
                    console.log(response) //////
                    trocaTela(false);
                    bloqueiaEdicao(false);
                    carregarLinks(); // recarrega lista de links
                }).catch(err => {
                    console.error(err)
                    trocaTela(false);
                    loadAjustes(false); // loading ternina
                    exibirMensagens(false, 'Ocorreu um erro, tente novamente!');
                    setTimeout(limparMensagens, 3500);
                    bloqueiaEdicao(false);
                });
        } else {
            if (inputPath.value.trim().length < slug.length || inputPath.value.trim().length > slug.length) {
                inputPath.value = `${slug.length} DÍGITOS!`;
                inputPath.classList.add('alerta');
                inputPath.classList.add('animate__shakeX');
                setTimeout(() => {
                    inputPath.classList.remove('alerta');
                    inputPath.classList.remove('animate__shakeX');
                    inputPath.value = `${slug}`;
                    bloqueiaEdicao(false);
                }, 1500);
            }
            if (inputUrl.value.trim().length < 6) {
                inputUrl.value = `URL INVÁLIDA!`;
                inputUrl.classList.add('alerta');
                inputUrl.classList.add('animate__shakeX');
                setTimeout(() => {
                    inputUrl.classList.remove('alerta');
                    inputUrl.classList.remove('animate__shakeX');
                    inputUrl.value = `${linkOriginal}`;
                    bloqueiaEdicao(false);
                }, 1500);
            }
            setTimeout(() => {
                bloqueiaEdicao(false);
            }, 1500);
        }
    });
}

function bloqueiaEdicao(ok) {
    if (ok) {
        btnSalvarEdit.disabled = true;
        inputPath.disabled = true;
        inputUrl.disabled = true;
    } else {
        btnSalvarEdit.disabled = false;
        inputPath.disabled = false;
        inputUrl.disabled = false;
    }
}