import type en from "../en/developer";

const developer: typeof en = {
  "keys": {
    "title": "Chaves de API",
    "subtitle": "Crie uma chave para conectar seu próprio app à API pública.",
    "docsLink": "Documentação da API",
    "name": "Nome da chave",
    "namePlaceholder": "ex.: Servidor de conteúdo",
    "create": "Criar chave",
    "creating": "Criando…",
    "created": "A chave “{name}” está pronta. Copie agora — ela não será exibida completa de novo.",
    "copy": "Copiar",
    "copied": "Copiada",
    "gotIt": "Entendi",
    "empty": "Nenhuma chave ainda. Crie a primeira no formulário acima.",
    "cols": {
      "name": "Nome",
      "key": "Chave",
      "created": "Criada em",
      "lastUsed": "Último uso",
      "site": "Site"
    },
    "active": "Ativa",
    "revoked": "Revogada",
    "revoke": "Revogar",
    "revokeConfirm": "Revogar “{name}”? Qualquer app que use essa chave perde o acesso na hora.",
    "errors": {
      "load": "Não conseguimos carregar suas chaves de API.",
      "loadNetwork": "Problema de conexão ao carregar suas chaves de API.",
      "create": "Não conseguimos criar a chave.",
      "createNetwork": "Problema de conexão ao criar a chave.",
      "revoke": "Não conseguimos revogar a chave.",
      "revokeNetwork": "Problema de conexão ao revogar a chave."
    },
    "sitesFailed": "Não foi possível carregar seus sites.",
    "sitesLoading": "Carregando…",
    "noSites": "Nenhum site ainda",
    "addSiteFirst": "Adicione primeiro um site para criar uma chave.",
    "legacySite": "Primeiro site (chave antiga)"
  },
  "docs": {
    "title": "Documentação da API",
    "subtitle": "Conecte seu app à API pública e gerencie seus artigos.",
    "createKey": "Criar chave de API",
    "auth": "Autenticação",
    "authBody": "Envie sua chave de API em todas as requisições, em um dos dois formatos abaixo. As chaves são criadas na página “Chaves de API” — cada uma aparece só uma vez, então guarde em um lugar seguro.",
    "orEquivalent": "Ou, de forma equivalente:",
    "unauthorized": "Se a chave estiver ausente, inválida ou revogada, você recebe uma resposta {code}:",
    "baseUrl": "URL base",
    "endpoints": "Endpoints",
    "listArticles": "Lista os artigos do site ao qual esta chave pertence, dos mais recentes para os mais antigos.",
    "showArticle": "Retorna um artigo completo, com seções e banner.",
    "createTask": "Cria uma tarefa de geração de artigo e a inicia em segundo plano.",
    "taskStatus": "Retorna o status de uma tarefa de geração. Quando concluída, a resposta inclui article_id.",
    "notes": "Bom saber",
    "note1": "Uma chave só acessa os artigos do site ao qual pertence.",
    "note2": "Ao revogar uma chave, o acesso dela é cortado na hora.",
    "note3": "Para gerar um artigo, crie uma tarefa e consulte o status periodicamente (por exemplo, a cada 30 segundos), em vez de esperar uma única requisição longa."
  }
};

export default developer;
