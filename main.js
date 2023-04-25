fetch('config.json')
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