import type en from "../en/analyze";

const analyze: typeof en = {
  "failed": "A análise não foi concluída",
  "phase": {
    "queued": "Pedido recebido",
    "crawling": "Lendo as páginas do seu site…",
    "analyzing": "Analisando o seu conteúdo…",
    "done": "Análise concluída"
  },
  "ideaSteps": {
    "connecting": "Conectando às fontes de dados (Google Trends, Autocomplete, SERP)",
    "keywords": "Avaliando palavras-chave em torno dos seus temas principais",
    "generating": "Criando ideias de artigos com IA",
    "scoring": "Avaliando a concorrência e calculando a nota de SEO"
  },
  "empty": {
    "title": "Analise o seu site",
    "body": "Digite um domínio abaixo e vamos identificar o seu segmento, resumir o seu conteúdo e mapear os principais temas (entidades) que você aborda.",
    "tagEntities": "Análise de entidades",
    "tagIdeas": "Ideias de artigos"
  },
  "input": {
    "placeholder": "exemplo.com.br — o endereço do seu site",
    "submit": "Analisar"
  },
  "progress": {
    "title": "Processando",
    "inProgress": "Em andamento…",
    "done": "Pronto",
    "hint": "Isso costuma levar alguns minutos."
  },
  "ideasBar": {
    "limit": "Você atingiu o limite de geração de ideias",
    "generating": "Escrevendo…",
    "cta": "Encontrar oportunidades de artigos"
  },
  "ideas": {
    "ready": {
      "one": "{count} ideia pronta",
      "other": "{count} ideias prontas"
    },
    "preparing": "Preparando…",
    "generatingTitle": "Gerando ideias de artigos",
    "retrying": "Tentando de novo…",
    "retry": "Tentar de novo"
  },
  "chat": {
    "yourRequest": "Seu pedido",
    "preparingIdeas": "Preparando ideias para o seu site…",
    "articleHeader": "Escrevendo um artigo nesta conversa",
    "assistant": "Assistente de estratégia de conteúdo",
    "selectedEntity": "Tema em foco: {name}",
    "preparing": "Abrindo uma nova conversa…"
  },
  "research": {
    "failed": "A pesquisa de conteúdo não foi concluída",
    "clustersTitle": "Montando clusters de palavras-chave",
    "gapsTitle": "Analisando concorrentes e lacunas de conteúdo",
    "clusters": "Clusters de palavras-chave",
    "gapsResult": "Lacunas de conteúdo e análise da concorrência",
    "clusterSteps": {
      "read": "Lendo os temas e palavras-chave do seu site",
      "build": "Agrupando buscas em clusters",
      "estimate": "Estimando potencial e tendências"
    },
    "gapSteps": {
      "context": "Entendendo o seu negócio",
      "competitors": "Encontrando seus concorrentes reais",
      "gaps": "Identificando lacunas de conteúdo"
    },
    "intent": {
      "informational": "Informacional",
      "commercial": "Comercial",
      "transactional": "Transacional",
      "navigational": "Navegacional"
    },
    "coverage": {
      "missing": "Fora dos resultados do Google",
      "weak": "Mal posicionado",
      "low": "Posição baixa"
    },
    "level": {
      "low": "baixa",
      "medium": "média",
      "high": "alta"
    },
    "priority": {
      "high": "Prioridade alta",
      "medium": "Prioridade média",
      "low": "Prioridade baixa"
    },
    "difficulty": {
      "unavailable": "Indisponível nesta fonte",
      "estimated": "{score}/100 · estimativa da IA"
    },
    "volumeEstimate": "Estimativa da IA",
    "volumeObserved": "Impressões reais",
    "trend": "Tendência",
    "trendNeedsTwo": "São necessários dois períodos para comparar",
    "trendUnavailable": "Sem estimativa de tendência",
    "stats": {
      "competitors": "Concorrentes reais",
      "opportunities": "Oportunidades de conteúdo",
      "avgScore": "Nota média de oportunidade",
      "highThreat": "Concorrentes de alto risco"
    },
    "strengths": "O que o seu site faz bem",
    "weaknesses": "Onde você pode melhorar",
    "visibility": "Visibilidade nas buscas",
    "depth": "Profundidade do conteúdo",
    "opportunitiesTitle": "Oportunidades de conteúdo (ordenadas com base em resultados reais do Google)",
    "takeAction": "Aproveitar",
    "recommendedAction": "Abordagem sugerida",
    "competitorSites": "Sites concorrentes ({count})",
    "rank": "Posição {rank}",
    "rankUnavailable": "Posição desconhecida",
    "sharedKeywords": {
      "one": "{count} palavra-chave em comum",
      "other": "{count} palavras-chave em comum"
    },
    "moreDetails": "Mais detalhes",
    "missing": "O que falta no seu site",
    "recommendations": "Recomendações gerais",
    "action": "Próximo passo: {action}",
    "fullReport": "Abrir o relatório completo",
    "opportunityScore": "Oportunidade {score}/100",
    "threat": "Risco: {level}",
    "received": "Combinado! Os resultados da pesquisa vão aparecer aqui mesmo, nesta conversa."
  },
  "entities": {
    "title": "Temas encontrados",
    "empty": "Nenhum tema encontrado ainda."
  },
  "request": {
    "title": "Pedido de análise de conteúdo",
    "body": "A IA analisa o seu conteúdo e os seus concorrentes para descobrir novas oportunidades"
  },
  "summary": {
    "title": "Resultado da análise",
    "industry": "Segmento: {niche}"
  },
  "user": {
    "start": "Analisar este site"
  },
  "idea": {
    "edit": "Editar ideia",
    "editShort": "Editar",
    "save": "Salvar alterações",
    "category": "Categoria:",
    "noLinks": "Nenhum link interno encontrado",
    "linksLabel": "Links internos:",
    "linksHint": "O artigo final vai linkar para estas páginas",
    "viewArticle": "Ver artigo",
    "viewArticleHint": "Abrir o artigo escrito a partir desta ideia",
    "generatingHint": "Um artigo está sendo escrito a partir desta ideia",
    "fields": {
      "title": "Título",
      "titlePlaceholder": "Título da ideia",
      "hook": "Gancho",
      "hookPlaceholder": "Uma frase de abertura que prenda o leitor",
      "meta": "Meta description",
      "metaPlaceholder": "Um resumo curto para os resultados de busca",
      "tags": "Tags",
      "tagsHint": "(separadas por vírgula)",
      "tagsPlaceholder": "SEO, marketing, conteúdo",
      "links": "Links internos",
      "linkTitle": "Texto do link",
      "related": "Relacionados",
      "removeLink": "Remover link",
      "addLink": "Adicionar link relacionado",
      "outline": "Estrutura",
      "outlineHint": "(um título por linha)"
    },
    "score": {
      "entity": "Relevância do tema",
      "intent": "Intenção de busca",
      "business": "Valor para o negócio",
      "serp": "Espaço para competir no Google",
      "summary": "Resumo:"
    },
    "errors": {
      "save": "Não conseguimos salvar suas alterações. Tente novamente."
    }
  },
  "gsc": {
    "connect": "Conectar o Google Search Console",
    "reconnect": "Reconectar o Google Search Console",
    "title": "Dados ao vivo do Google Search Console",
    "body": "Traga suas buscas, impressões, cliques, CTR e posições reais para a pesquisa de conteúdo — com acesso somente leitura.",
    "connected": "Conta conectada",
    "showProperties": "Mostrar meus sites verificados",
    "selectProperty": "Escolha uma propriedade",
    "connectProperty": "Usar este site",
    "lastSynced": "Última sincronização: {date}",
    "noData": "Ainda sem dados.",
    "syncing": "Buscando…",
    "sync": "Sincronizar agora",
    "impressions": "Impressões",
    "clicks": "Cliques",
    "topQueries": "Principais buscas por impressões",
    "queryStats": "{impressions} impressões · posição {position}",
    "errors": {
      "start": "Não conseguimos iniciar a conexão com o Google Search Console.",
      "noProperties": "A conta Google conectada não tem sites verificados. Desconecte-a no painel de automação do seu site e conecte a conta certa.",
      "properties": "Não conseguimos carregar seus sites do Search Console.",
      "select": "Não conseguimos conectar essa propriedade.",
      "sync": "Não conseguimos iniciar a sincronização com o Search Console.",
      "disconnect": "Não conseguimos desconectar o Search Console."
    }
  },
  "chatBar": {
    "trends": {
      "label": "Sugerir temas de artigos",
      "prompt": "Me dê oportunidades de conteúdo específicas e práticas, com base nas tendências relevantes para este site."
    },
    "gap": {
      "label": "Análise de lacunas em relação aos concorrentes",
      "prompt": "Analise os concorrentes relevantes deste site e as principais lacunas de conteúdo. Para cada lacuna, explique por que ela importa, qual o tamanho da ameaça e sugira uma abordagem para cobri-la."
    },
    "limit": "Faça upgrade do plano para continuar.",
    "choosePath": "Escolha um tipo de pesquisa",
    "gscConnect": "Conectar o Search Console",
    "connectGoogle": "Conectar conta Google",
    "loadingSites": "Carregando sites…",
    "showSites": "Mostrar meus sites",
    "select": "Escolher",
    "queriesReceived": "{count} buscas recebidas",
    "loadingData": "Carregando dados…",
    "readyToFetch": "Conectado — pronto para buscar os dados",
    "fetch": "Buscar dados",
    "connectedQueries": "Search Console conectado · {count} buscas",
    "fetchingGsc": "Buscando dados no Search Console…",
    "gscConnected": "Search Console conectado",
    "placeholder": "Faça uma pergunta ou conte o que você precisa…",
    "send": "Enviar"
  },
  "credits": {
    "banner": "Seus créditos grátis de conversa com o assistente de conteúdo acabaram. {still} Escolha um plano para continuar conversando.",
    "bannerStill": "Você ainda pode gerar artigos a partir das ideias que já tem.",
    "viewPlans": "Ver planos",
    "chatFree": "Seus créditos grátis de conversa com o assistente de conteúdo acabaram, então não dá para fazer novas perguntas — mas você ainda pode gerar artigos a partir das ideias que já tem. Para continuar conversando, escolha um plano na página de assinatura (/subscription).",
    "chatPaid": "Você não tem créditos suficientes para o assistente de conteúdo, mas ainda pode gerar artigos a partir das ideias que já tem. Recarregue ou faça upgrade na página de assinatura (/subscription).",
    "shortFree": "Seus créditos grátis acabaram. Assine para continuar.",
    "shortPaid": "Seus créditos acabaram. Recarregue ou faça upgrade do plano.",
    "barFree": "Seus créditos grátis do assistente de conteúdo acabaram. Assine para continuar.",
    "barPaid": "Créditos insuficientes para a análise de conteúdo. Recarregue ou faça upgrade do plano."
  },
  "entity": {
    "pick": "Escolha um tema",
    "pickPrompt": "Para encontrar oportunidades precisas e criar os links internos certos, escolha o tema (entidade) em que vamos focar.",
    "confirmed": "Perfeito — seu pedido foi enviado! Os resultados vão focar só no tema escolhido, e cada artigo vai linkar para a página correspondente do seu site."
  },
  "gapPrompt": "Crie uma ideia de conteúdo e um plano para esta oportunidade, encontrada na comparação com resultados reais do Google:\nOportunidade: {title}\nBusca alvo: {query}\nDetalhes: {details}\nAbordagem sugerida: {angle}",
  "gapLabel": "Aproveitar: {title}",
  "article": {
    "request": "Escreva um artigo para a ideia “{title}”.",
    "started": "O artigo está sendo escrito nesta conversa."
  },
  "nav": {
    "previous": "Mensagem anterior",
    "next": "Próxima mensagem",
    "latest": "Ir para a última mensagem",
    "latestShort": "Última"
  },
  "welcome": {
    "title": "Agente de SEO de {domain}",
    "hello": "Oi! Sou o assistente de SEO de {domain}.",
    "what": "Posso pesquisar as palavras-chave que importam, encontrar novas oportunidades de conteúdo, analisar seus concorrentes e sugerir temas para o seu site crescer.",
    "ask": "Pergunte o que quiser sobre SEO ou o conteúdo do seu site."
  },
  "errors": {
    "saveMessage": "Não conseguimos salvar essa mensagem.",
    "researchResults": "Não conseguimos carregar os resultados da pesquisa.",
    "history": "Não conseguimos carregar o histórico desta conversa.",
    "startSession": "Não conseguimos iniciar a conversa de análise deste site.",
    "research": "O pedido de pesquisa de conteúdo não foi concluído.",
    "opportunities": "O pedido de oportunidades de conteúdo não foi concluído.",
    "retry": "A nova tentativa não funcionou.",
    "status": "Não conseguimos obter o status da análise.",
    "domainRequired": "Digite um domínio, como exemplo.com.br.",
    "domainInvalid": "Digite só o domínio — sem http:// nem caminho —, como exemplo.com.br.",
    "addDomain": "Não conseguimos adicionar este domínio."
  }
};

export default analyze;
