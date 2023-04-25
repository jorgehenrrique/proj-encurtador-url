let respostaArquivo = await fetch("assets/file/user.json"); //resposta http json local
let usuario = await respostaArquivo.json();
