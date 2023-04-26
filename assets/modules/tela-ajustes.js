import {
    divModais, divModalBoo, divModalBooP, divModalEditar,
    modalBtnNao, modalBtnSim, telaAjustes, telaContainer
} from "./elementos.js";

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

function carregarLinks() {
    fetch('../config.json')
        .then(response => response.json())
        .then(data => {
            const apiKey = data.apiKey;
            const domainId = data.domainId;
            // console.log(apiKey, domainId);
            requestKey(data);
        })
        .catch(error => console.error('Erro ao buscar config.json:', error));

    function requestKey(env) {
        console.log(env.apiKey)
        console.log(env.domainId)
    }
}
