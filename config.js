// KEY TEMPORÁRIA PARA TESTE

export let chaves = {
	apiKey: "sk_tIngbi0Tiqk2GPJG",
	domainId: "715013",
	domainUrl: "964u.short.gy"
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
