// KEY TEMPORÁRIA PARA USO

export let chaves = {
	apiKey: "",
	domainId: "",
	domainUrl: ""
}

// Restaura local
function restaurarChavesLocal() {
	const chavesRestauradas = JSON.parse(localStorage.getItem('keys'));

	if (chavesRestauradas !== null) { // Evitar erro ao tentar carregar json nulo
		for (let keys in chavesRestauradas) {
			chaves[keys] = chavesRestauradas[keys];
		}
	}
}
restaurarChavesLocal();
