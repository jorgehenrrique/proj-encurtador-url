import {
    divModais, divModalBoo, divModalBooP, divModalEditar,
    modalBtnNao, modalBtnSim, telaAjustes, telaContainer, logo, loading, dominio, listaLinks
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
    console.log('deu certo')
    divModais.style.display = 'block';
    divModalBoo.style.display = 'block';
    divModalBooP.innerText = 'Deseja voltar a tela inicial?';

    modalBtnSim.addEventListener('click', () => trocaTela(true))
    modalBtnNao.addEventListener('click', () => trocaTela(false))
}

export function carregarLinks() {
    fetch('../config.json')
        .then(response => response.json())
        .then(data => {
            const apiKey = data.apiKey;
            const domainId = data.domainId;
            solicitaAcesso(apiKey, domainId);
        })
        .catch(error => console.error('Erro ao buscar config.json:', error));

    function solicitaAcesso(apiKey, domainId) {

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
                // console.log(data.links)
                // data.links.forEach(element => {
                //     console.log(element)
                // });
                montaTabela(data.links);
            })
            .catch(err => console.error(err));
    }
}

function montaTabela(dados) {
    let dominios = dados[0].shortURL.split('//');
    dominios = dominios[1].split('/');
    dominios = dominios[0];

    // console.log(dados[0].shortURL)
    dominio.innerHTML = `Domínio: <a href="https://short.io/pt">${dominios}</a>`;
    listaLinks.innerHTML = `<tr>
        <td colspan="4">Nenhum link disponível</td>
    </tr>`;
    dados.forEach(element => {
        // console.log(element)
        console.log(element.shortURL)
        console.log(element.originalURL)
        console.log(element.createdAt)
    });

    dados.forEach(element => {
        listaLinks.innerHTML += `<tr>
        <td>${element.shortURL}</td>
        <td>${element.originalURL}</td>
        <td>${element.createdAt}</td>
        <td><img src="assets/icon/conf/edit.png" class="icon-conf" style="width: 20px;" onclick="editarLink(${0})"> <img src="assets/icon/conf/del.png" class="icon-conf" style="width: 20px;" onclick="excluirLink(${1})"></td>
    </tr>`
    });
}

function editarLink(link) {
    console.log(`${link} Editado`)
}

function excluirLink(link) {
    console.log(`${link} Excluido`)
}