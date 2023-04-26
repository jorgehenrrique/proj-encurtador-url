import { chaves } from "../../config.js";
import {
    divModais, divModalBoo, divModalBooP, divModalEditar,
    modalBtnNao, modalBtnSim, telaAjustes, telaContainer,
    logo, loading, dominio, listaLinks, divModalEditarP, fecharModal, inputPath, inputUrl, btnSalvarEdit,
} from "../modules/elementos.js";

function exibirMensagens(status, mensagem) {
    document.querySelector('.mensagem-adc-categoria').innerHTML = mensagem;
    document.querySelector('.mensagem-adc-despesa').innerHTML = mensagem;
    if (status) {
        document.querySelector('.mensagem-adc-categoria').classList.remove('mensagem-alerta');
        document.querySelector('.mensagem-adc-categoria').classList.remove('none');
        document.querySelector('.mensagem-adc-despesa').classList.remove('mensagem-alerta');
        document.querySelector('.mensagem-adc-despesa').classList.remove('none');
        // setTimeout(limparMensagens, 3500); // Movido para local de chamada da mensagem, para limpar com tempo indemendente
    } else {
        document.querySelector('.mensagem-adc-categoria').classList.add('mensagem-alerta');
        document.querySelector('.mensagem-adc-categoria').classList.remove('none');
        document.querySelector('.mensagem-adc-despesa').classList.add('mensagem-alerta');
        document.querySelector('.mensagem-adc-despesa').classList.remove('none');
        // setTimeout(limparMensagens, 3500); // Movido para local de chamada da mensagem, para limpar com tempo indemendente
    }
}

function trocaTela(status) { // Sai dos ajustes pela escolha do modal
    if (status) {
        telaContainer.style.display = 'flex';
        telaAjustes.style.display = 'none';
        divModais.style.display = 'none';
        divModalBoo.style.display = 'none';
        divModalEditar.style.display = 'none';
    } else {
        divModais.style.display = 'none';
        divModalBoo.style.display = 'none';
        divModalEditar.style.display = 'none';
    }
}

logo.onclick = () => { // Clique na logo
    divModais.style.display = 'block';
    divModalBoo.style.display = 'block';
    divModalBooP.innerText = 'Deseja voltar a tela inicial?';

    modalBtnSim.addEventListener('click', () => trocaTela(true))
    modalBtnNao.addEventListener('click', () => trocaTela(false))
}

export function carregarLinks() { // Recolher keys
    const apiKey = chaves.apiKey;
    const domainId = chaves.domainId;
    solicitaAcesso(apiKey, domainId);
    // console.log(apiKey, domainId)
}

function solicitaAcesso(apiKey, domainId) { // Acessar api de links

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
            montaTabela(data.links);
        })
        .catch(err => console.error(err));
}


// || Monta batela de links
function montaTabela(dados) {
    let dominios = dados[0].shortURL.split('//');
    dominios = dominios[1].split('/');
    dominios = dominios[0];

    dominio.innerHTML = `Domínio: <a href="https://short.io/pt">${dominios}</a>`;
    listaLinks.innerHTML = ``;
    dados.forEach(element => {
        // console.log(element)
        // console.log(element.shortURL)
        // console.log(element.originalURL)
        // console.log(element.createdAt)
    });

    dados.forEach(element => {
        let time = formataData(element.createdAt);

        listaLinks.innerHTML += `<tr>
        <td>${element.shortURL}</td>
        <td>${element.originalURL}</td>
        <td>${time.date} às ${time.time}</td>
        <td><img src="assets/icon/conf/edit.png" class="icon-conf edit-icon" style="width: 20px;" id-string="${element.idString}" lin="${element.shortURL}" lin2="${element.originalURL}"> <img src="assets/icon/conf/del.png" class="icon-conf delete-icon" style="width: 20px;" id-string="${element.idString}" lin="${element.shortURL}"></td>
    </tr>`
        montarEventos();
    });

};

// || Formata data
function formataData(dateTime) {
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
            editarLink(idString, link, linkOriginal);
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

function editarLink(linkId, link, linkOriginal) { // Modal editar link
    console.log(`${linkId} Editado ${link}`)
    divModais.style.display = 'block';
    divModalEditar.style.display = 'block';
    divModalEditarP.innerText = `Editando: ${link}`;

    fecharModal.addEventListener('click', () => trocaTela(false));
    tratarEdicao(linkId, link, linkOriginal);
}

function excluirLink(linkId, link) { // Modal confirma excluir link
    console.log(`${linkId} Excluido ${link}`)
    divModais.style.display = 'block';
    divModalBoo.style.display = 'block';
    divModalBooP.innerText = `Deseja excluir o link: ${link}`;

    modalBtnNao.addEventListener('click', () => trocaTela(false));
    modalBtnSim.addEventListener('click', () => deletarLink(linkId));
}


// || Delete link
function deletarLink(linkId) {
    const apiKey = chaves.apiKey;

    const options = { method: 'DELETE', headers: { Authorization: `${apiKey}` } };

    fetch(`https://api.short.io/links/${linkId}`, options)
        .then(response => {
            if (response.ok && response.status === 200) {
                return response.json();
            } else { throw new Error('Resposta do servidor: ', response.status) }
        }).then(response => {
            console.log('Deletado?', response);
            trocaTela(false);
            carregarLinks();
            // tratar mensagens de sucesso
        }).catch(err => console.error(err));
}


// || Editar link
function tratarEdicao(linkId, link, linkOriginal) {
    let slug = link.split('/');
    slug = slug[3];

    inputPath.value = `${slug}`;
    inputUrl.value = `${linkOriginal}`;


    btnSalvarEdit.addEventListener('click', () => {
        slug = inputPath.value.trim();
        linkOriginal = inputUrl.value.trim();

        const apiKey = chaves.apiKey;
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization: `${apiKey}`
            },
            body: JSON.stringify({ originalURL: `${linkOriginal}`, path: `${slug}` })
        };

        fetch(`https://api.short.io/links/${linkId}`, options)
            .then(response => {
                if (response.ok && response.status === 200) {
                    return response.json();
                } else { throw new Error('Resposta do servidor: ', response.status) }
            }).then(response => {
                console.log(response)
                trocaTela(false);
                carregarLinks();
            }).catch(err => console.error(err));
    });

}