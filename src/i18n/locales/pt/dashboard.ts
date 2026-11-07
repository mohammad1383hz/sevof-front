import type en from "../en/dashboard";

const dashboard: typeof en = {
  "view": "Ver",
  "noResults": "Nenhum resultado para a sua busca.",
  "page": {
    "title": "Painel de artigos",
    "subtitle": "O que o seu agente de IA está fazendo neste site",
    "noSiteTitle": "Nenhum site adicionado ainda",
    "noSiteBody": "Adicione um site para ver ideias, artigos e a atividade do piloto automático."
  },
  "errors": {
    "load": "Não conseguimos carregar o painel.",
    "network": "Problema de conexão — o painel não carregou.",
    "autopilot": "Não conseguimos atualizar o piloto automático.",
    "ideas": "Algo deu errado ao gerar as ideias.",
    "invalidSite": "Este link de site não é válido.",
    "ideasLoad": "Não conseguimos carregar as ideias de conteúdo.",
    "writtenLoad": "Não conseguimos carregar os artigos escritos.",
    "publishedLoad": "Não conseguimos carregar os artigos publicados.",
    "keywordsLoad": "Não conseguimos carregar as palavras-chave."
  },
  "articleStatus": {
    "completed": "Concluído",
    "failed": "Falhou",
    "pending": "Na fila",
    "generating": "Escrevendo…"
  },
  "ideaStatus": {
    "approved": "Aprovada",
    "rejected": "Recusada",
    "used": "Usada",
    "recommended": "Sugerida"
  },
  "publishStatus": {
    "published": "Publicado",
    "draft": "Rascunho",
    "failed": "Falhou"
  },
  "stats": {
    "totalArticles": "Total de artigos",
    "published": "Publicados",
    "generating": "Em andamento",
    "failed": "Com falha",
    "avgSeo": "Nota média de SEO",
    "totalWords": "Palavras escritas"
  },
  "recent": {
    "title": "Artigos recentes",
    "empty": "Nenhum artigo ainda.",
    "publishedOn": "Publicado em {date}"
  },
  "connection": {
    "checking": "Verificando a conexão com o seu site…",
    "switchBack": "Voltar para {platform}",
    "connectVia": "Conectar com {platform}",
    "apiTitle": "Conectar pela API pública",
    "apiBody": "Crie e leia artigos a partir do seu próprio app, mesmo sem WordPress ou Shopify. Documentação completa, exemplos de código e guia de chaves de API.",
    "docs": "Docs",
    "platform": "Plataforma de publicação",
    "comingSoon": "Em breve",
    "soon": "em breve"
  },
  "opportunities": {
    "title": "Novas oportunidades",
    "discovering": "Procurando…",
    "discover": "Encontrar novas oportunidades",
    "empty": "Nenhuma oportunidade ainda. Clique em “Encontrar novas oportunidades” para começar.",
    "generatedHint": "Artigo pronto — ele está na sua lista de artigos",
    "generated": "Escrito",
    "generate": "Escrever artigo",
    "keywords": "Palavras-chave encontradas",
    "entities": "Temas identificados"
  },
  "opportunitiesPage": {
    "title": "Oportunidades de conteúdo",
    "subtitle": "Ideias de artigos escolhidas para o seu site",
    "topic": "Tema",
    "entity": "Entidade principal",
    "competitor": "Concorrência",
    "search": "Buscar temas ou entidades…",
    "empty": "Nenhuma ideia de conteúdo ainda."
  },
  "gap": {
    "uncovered": "Ainda não coberto",
    "covered": "Já coberto",
    "reviewing": "Verificando"
  },
  "columns": {
    "title": "Título do artigo",
    "keyword": "Palavra-chave alvo",
    "words": "Palavras",
    "status": "Status",
    "publishStatus": "Publicação",
    "date": "Data",
    "url": "URL publicada"
  },
  "written": {
    "title": "Artigos escritos",
    "subtitle": "Tudo o que o piloto automático já escreveu para o seu site",
    "empty": "Nenhum artigo escrito ainda."
  },
  "published": {
    "title": "Artigos publicados",
    "subtitleShort": "Todas as tentativas de publicação do seu agente",
    "subtitle": "Todas as tentativas de publicação do seu agente — publicados, salvos como rascunho ou com falha",
    "empty": "Nada foi publicado ainda.",
    "errorDetails": "Ver detalhes do erro"
  },
  "keywords": {
    "title": "Palavras-chave",
    "subtitle": "Palavras-chave que o piloto automático encontrou para o seu site",
    "keyword": "Palavra-chave",
    "primary": "Principal",
    "difficulty": "Dificuldade",
    "analyzing": "Estamos analisando seu site em busca de palavras-chave. Pode levar um instante…",
    "empty": "Nenhuma palavra-chave encontrada ainda."
  },
  "difficulty": {
    "Low": "Fácil",
    "Medium": "Média",
    "High": "Difícil",
    "Unknown": "Desconhecida"
  },
  "agent": {
    "status": {
      "idle": "Em espera",
      "working": "Trabalhando",
      "generatingIdeas": "Gerando ideias",
      "writing": "Escrevendo um artigo",
      "waitingIdeas": "Aguardando ideias avaliadas",
      "dailyLimit": "Limite diário atingido",
      "needsAnalysis": "É preciso analisar o site primeiro",
      "unknown": "Desconhecido"
    },
    "features": {
      "research": "Pesquisa de concorrentes e palavras-chave",
      "daily": "Ideias e artigos novos todos os dias",
      "autoPublish": "Publicação automática",
      "scheduling": "Agendamento inteligente",
      "wordpress": "Publicação no WordPress com um clique"
    },
    "pipeline": {
      "badge": "Fluxo de conteúdo",
      "intro": "O piloto automático executa estas quatro etapas em sequência — sem você precisar fazer nada.",
      "keywordsTitle": "Encontrar palavras-chave",
      "keywordsDesc": "Analisa seu site e encontra as palavras-chave que importam",
      "ideasTitle": "Planejar ideias",
      "ideasDesc": "Transforma cada oportunidade em uma ideia de artigo",
      "writeTitle": "Escrever artigos",
      "writeDesc": "Escreve artigos completos e otimizados para SEO",
      "publishTitle": "Publicar",
      "publishDesc": "Publica os artigos no seu site WordPress"
    },
    "stats": {
      "keywords": "Palavras-chave encontradas",
      "opportunities": "Oportunidades encontradas",
      "written": "Artigos escritos",
      "published": "Artigos publicados"
    },
    "locked": {
      "badge": "Recurso Pro",
      "title": "Coloque seu SEO no piloto automático com o Pro",
      "body": "Monitora seu site 24 horas por dia, pesquisa concorrentes e palavras-chave e escreve e publica artigos otimizados para SEO por você.",
      "cta": "Fazer upgrade para o Pro"
    },
    "enableTitle": "Ativar piloto automático",
    "enable": "Ativar",
    "enabling": "Ativando…",
    "onTitle": "Piloto automático ativado",
    "settings": "Configurações"
  },
  "settings": {
    "title": "Configurações do piloto automático",
    "publishStatus": "Quando um artigo ficar pronto",
    "publishHint": "Os artigos vão ao ar assim que ficam prontos.",
    "draftHint": "Os artigos ficam como rascunho até você revisar e publicar.",
    "publishOptions": {
      "draft": "Salvar como rascunho",
      "publish": "Publicar automaticamente"
    },
    "perCycle": "Artigos por ciclo",
    "perCycleHint": "Quantos artigos são escritos a cada ciclo.",
    "schedule": "Frequência",
    "scheduleHint": "Com que frequência o piloto automático deve rodar?",
    "customInterval": "A cada quantos dias",
    "customIntervalHint": "Por exemplo, 5 significa uma vez a cada 5 dias.",
    "startTime": "Horário de início",
    "startTimeHint": "O piloto automático começa a trabalhar nesse horário.",
    "sectionCount": "Tamanho do artigo",
    "sectionCountHint": "Define a estrutura geral de cada artigo.",
    "sections": {
      "short": "6–8 seções (curto)",
      "medium": "8–10 seções (médio)",
      "long": "10–12 seções (longo)"
    },
    "intervalOptions": {
      "d1": "Todos os dias",
      "d2": "Dia sim, dia não",
      "d3": "A cada 3 dias",
      "d7": "Uma vez por semana",
      "custom": "Personalizado"
    },
    "interval": {
      "everyDay": "todos os dias",
      "everyOtherDay": "dia sim, dia não",
      "everyWeek": "uma vez por semana",
      "everyNDays": "a cada {days} dias"
    },
    "preview": {
      "short": "Sua programação: {count} artigos {interval}",
      "publish": "O piloto automático começa às {time} e, {interval}, escreve {count} artigos e os publica automaticamente.",
      "draft": "O piloto automático começa às {time} e, {interval}, escreve {count} artigos e os salva como rascunho para você revisar.",
      "publishWithImages": "O piloto automático começa às {time} e, {interval}, escreve {count} artigos com {images} imagens cada e os publica automaticamente.",
      "draftWithImages": "O piloto automático começa às {time} e, {interval}, escreve {count} artigos com {images} imagens cada e os salva como rascunho para você revisar."
    },
    "articleModel": "Modelo de escrita",
    "imagesTitle": "Imagens para os seus artigos",
    "imageModel": "Modelo de imagem",
    "imagesPerArticle": "Imagens por artigo",
    "perImage": "por imagem",
    "perArticle": "por artigo",
    "credits": "{count} créditos",
    "recommended": "Recomendado",
    "decrease": "Diminuir",
    "increase": "Aumentar",
    "advanced": "Avançado",
    "advancedHint": "Suas próprias instruções para artigos e imagens (opcional)",
    "articlePrompt": "Instruções para o artigo",
    "articlePromptHint": "Deixe em branco e o artigo será escrito do jeito padrão.",
    "articlePromptPlaceholder": "ex.: Tom leve e amigável, para iniciantes",
    "imagePrompt": "Instruções para a imagem de destaque",
    "imagePromptHint": "Deixe em branco e o prompt será criado a partir do artigo.",
    "imagePromptPlaceholder": "ex.: Cores quentes, sem texto na imagem",
    "summary": "Resumo",
    "save": "Salvar configurações"
  },
  "wp": {
    "title": "Conexão com o WordPress",
    "subtitle": "Publique artigos direto no seu site WordPress",
    "status": {
      "connected": "Conectado",
      "pending": "Aguardando configuração",
      "disconnected": "Desconectado"
    },
    "health": {
      "healthy": "Funcionando",
      "unhealthy": "Erro",
      "unreachable": "Inacessível"
    },
    "verified": "Listado no WordPress.org",
    "shownOnce": "Exibido só uma vez",
    "copy": "Copiar {label}",
    "downloadLatest": "Baixar a versão mais recente do plugin",
    "plugin": "Plugin do WordPress",
    "pluginBody": "Instale o plugin no seu site. Depois de conectado, os artigos são escritos e publicados por você.",
    "download": "Baixar plugin",
    "credentials": {
      "title": "Seus dados de conexão",
      "body": "Cole estes três valores nas configurações do plugin no seu site — é só isso para começar a publicar automaticamente.",
      "warning": "Depois que você fechar esta janela, o Client Secret não será exibido de novo. Se perder, use “Reconectar” para gerar novos dados.",
      "done": "Já salvei"
    },
    "checking": "Verificando a conexão…",
    "empty": "Nenhum site WordPress conectado ainda",
    "emptyBody": "Ao conectar, você recebe um Client ID e um Client Secret para informar no plugin do WordPress do seu site.",
    "connect": "Conectar WordPress",
    "waiting": "Aguardando o plugin do WordPress se conectar",
    "waitingBody": "Informe seu Client ID, API Key e Client Secret nas configurações do plugin para concluir. Perdeu os dados? Clique em “Reconectar” para gerar novos.",
    "check": "Verificar conexão",
    "newCredentials": "Gerar novas credenciais",
    "siteUrl": "URL do site",
    "versions": "Versão do WordPress / do plugin",
    "pluginVersion": "plugin {version}",
    "healthTitle": "Saúde",
    "lastCheck": "Última verificação",
    "test": "Testar conexão",
    "reconnect": "Reconectar",
    "disconnect": "Desconectar",
    "disconnected": "WordPress desconectado",
    "testOk": "Tudo certo — seu site WordPress está acessível.",
    "testBad": "Seu site WordPress não respondeu como esperado.",
    "confirmReconnectTitle": "Gerar novos dados de conexão?",
    "confirmReconnectBody": "Seus dados atuais vão parar de funcionar e você precisará informar os novos no plugin do WordPress.",
    "confirmDisconnectTitle": "Desconectar o WordPress?",
    "confirmDisconnectBody": "Os artigos não serão mais publicados automaticamente neste site. Para reconectar, será preciso refazer a configuração.",
    "errors": {
      "load": "Não conseguimos verificar sua conexão com o WordPress.",
      "loadNetwork": "Problema de conexão ao verificar o WordPress.",
      "connect": "Não conseguimos conectar ao WordPress.",
      "reconnect": "Não deu para reconectar.",
      "disconnect": "Não conseguimos desconectar.",
      "testNetwork": "Problema de conexão durante o teste."
    }
  },
  "mixin": {
    "title": "Conexão com a Mixin",
    "subtitle": "Publique artigos direto na sua loja Mixin",
    "connected": "Mixin conectada",
    "disconnected": "Mixin desconectada",
    "testOk": "Tudo certo — a Mixin está acessível.",
    "testBad": "A Mixin não respondeu como esperado.",
    "changeIntro": "Informe um novo token. Vamos testá-lo antes de salvar — seu token atual continua valendo se o teste falhar.",
    "connectIntro": "Informe seu token da Mixin. Vamos testar a conexão com a sua loja antes de salvar e avisar se algo estiver errado.",
    "siteUrl": "URL da loja",
    "currentToken": "Token atual",
    "token": "Token da Mixin",
    "tokenShort": "Token",
    "newToken": "Novo token",
    "tokenPlaceholder": "Cole seu token aqui",
    "newTokenPlaceholder": "Cole seu novo token aqui",
    "hideToken": "Ocultar token",
    "showToken": "Mostrar token",
    "testing": "Testando a conexão…",
    "testAndConnect": "Testar e conectar",
    "changeToken": "Trocar token",
    "confirmTitle": "Desconectar a Mixin?",
    "confirmBody": "Os artigos não serão mais publicados automaticamente na Mixin. Para reconectar, você vai precisar informar o token de novo.",
    "errors": {
      "load": "Não conseguimos verificar sua conexão com a Mixin.",
      "loadNetwork": "Problema de conexão ao verificar a Mixin.",
      "tokenShort": "Cole o token completo.",
      "connect": "Não conseguimos conectar à Mixin. Confira a URL da loja e o token."
    }
  },
  "kwAnalysis": {
    "title": "Localizador de palavras-chave",
    "steps": {
      "pending": "Pedido recebido",
      "processing": "Buscando dados do Google Trends",
      "selecting": "A IA está escolhendo a melhor palavra-chave",
      "done": "Preparando seus resultados"
    },
    "progress": "Analisando palavras-chave ({done}/{total} verificadas)",
    "starting": "Começando…",
    "note": "Atenção: o Google Trends limita as consultas, então cada palavra-chave pode levar até um minuto.",
    "processing": "Em andamento…",
    "completed": "Pronto",
    "failed": "A análise de palavras-chave falhou",
    "finalBadge": "Sua palavra-chave",
    "suggestedTitle": "Título sugerido",
    "checked": "Palavras-chave verificadas ({count})",
    "finalSelection": "Escolhida",
    "fetched": "Dados recebidos",
    "fetchError": "Não foi possível obter os dados",
    "topQueries": "Principais buscas relacionadas",
    "risingQueries": "Buscas em alta",
    "noData": "Sem dados",
    "breakout": "Em disparada",
    "backToAnalysis": "Voltar à análise do site",
    "errors": {
      "status": "Não conseguimos obter o status da análise.",
      "start": "Não conseguimos iniciar a análise de palavras-chave.",
      "site": "Não conseguimos carregar os dados do site."
    }
  },
  "shopify": {
    "title": "Conexão com o Shopify",
    "subtitle": "Publique artigos de blog e correções de SEO de produtos direto na sua loja Shopify",
    "connected": "Conectado",
    "loadFailed": "Não foi possível carregar a conexão com o Shopify.",
    "connectedBanner": "Sua loja Shopify está conectada. Estamos importando seus produtos.",
    "invalidShop": "Digite o endereço da sua loja, por ex. sua-loja.myshopify.com.",
    "installFailed": "Não foi possível iniciar a conexão com o Shopify. Tente novamente.",
    "testOk": "Tudo certo — sua loja está acessível.",
    "testBad": "O Shopify não respondeu como esperado.",
    "disconnected": "Loja Shopify desconectada.",
    "disconnectFailed": "Não foi possível desconectar a loja.",
    "store": "Loja",
    "storefront": "Vitrine",
    "connectedHelp": "Os artigos são publicados no blog da sua loja, e as correções de produto aprovadas atualizam seus produtos no Shopify. Seus produtos são sincronizados automaticamente toda noite.",
    "confirmTitle": "Desconectar o Shopify?",
    "confirmBody": "O app do Sevof será removido da sua loja. Os artigos já publicados continuam no seu blog.",
    "disconnecting": "Desconectando…",
    "disconnect": "Desconectar",
    "cancel": "Cancelar",
    "test": "Testar conexão",
    "notConfigured": "A publicação no Shopify ainda não está disponível neste servidor. Fale com o suporte.",
    "intro": "Digite o endereço da sua loja e aprove o app do Sevof no Shopify. Você voltará para cá ao terminar.",
    "shopLabel": "Endereço da loja",
    "shopHint": "Seu endereço myshopify.com — você o encontra no admin do Shopify em Configurações → Domínios.",
    "redirecting": "Abrindo o Shopify…",
    "connect": "Conectar Shopify",
    "permissions": "O Sevof só pede acesso ao seu blog, produtos e arquivos. Você pode remover o app do Shopify quando quiser.",
    "pickTitle": "Conecte sua loja Shopify",
    "pickBody": "Escolha o site do Sevof ao qual esta loja pertence. Em seguida você aprova o app no Shopify.",
    "noSites": "Você ainda não tem nenhum site no Sevof. Adicione primeiro o domínio da sua loja e volte aqui.",
    "addSite": "Adicionar um site"
  }
};

export default dashboard;
