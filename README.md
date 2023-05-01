# Projeto - Encurtador de URL

## Projeto de conclusão de módulo - Javascript Avançado
## Sobre o projeto

Criação de Encurtador de URL baseado na API short.io

O protótipo de telas com as especificações: [Miro](https://miro.com/app/board/uXjVMQUy4z4=/)
Projeto utiliza a API: [API short.io](https://app.short.io/settings/integrations/api-key)
### Especificações funcionais:
* Utilizar com maestria o HTML, CSS e JavaScript (import e export)
* Layout responsivo (mobile)
* Utilizar o fetch API para fazer as requisições
* Trabalhar as mensagens de erro no catch
* Pode usar o async, await
* Trabalhar uma mensagem e/ou img de carregando nas páginas onde tenha requisição, é muito importante, isso vale para as ações dos botões também (Ex.: clicou, mudar o layout do botão e desabilitar sua ação até obter a resposta ele voltar para o estado "normal").
* Atenção para todas as telas tem mensagens que são importantes
* Atenção para analisar como armazenar alguns dados frequentemente usados como:
* **iDomain**, **idString**, **hostname**

## Telas:

### Tela Inicial

<img src="assets/requisitos/Tela-Inicial.png">

### Carregando

<img src="assets/requisitos/Carregando.png">

### Resultado - Copiar

<img src="assets/requisitos/Resultado-Copiar.png">

### Resultado - Compartilhar

<img src="assets/requisitos/Resultado-Compartilhar.png">

### Resultado QR Code

<img src="assets/requisitos/Resultado-QR-Code.png">

### Lista de Links Cadastrados

<img src="assets/requisitos/Lista-de-Links-Cadastrados.png">

### Lista de Links Mensagens

<img src="assets/requisitos/Lista-de-Links-Mensagens.png">

### Lista de Links Editar

<img src="assets/requisitos/Lista-de-Links-Editar.png">

### Lista de Links Excluir

<img src="assets/requisitos/Lista-de-Links-Excluir.png">


### Para utilizar o código, crie sua conta e obtenha sua api key

* [Acesse e crie sua conta](https://short.io/pt)

* Feito isso, crie um arquivo chamado: **config.json**
* E adicione o seguinte:

```js
export const chaves = {
    "apiKey": "sua_api_key",
    "domainId": "seu_id_domain",
    "domainUrl": "seu_url_domain"
}
```