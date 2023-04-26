import {
    btnEncurtar, conf, inputEncurtar, loading,
    logo, telaAjustes, telaContainer
} from "./assets/modules/elementos.js";

conf.onclick = () => {
    if (telaContainer.style.display === '' || telaContainer.style.display === 'flex') {
        telaAjustes.style.display = 'flex';
        telaContainer.style.display = 'none';
    } else {
        telaContainer.style.display = 'flex';
        telaAjustes.style.display = 'none';
    }
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

