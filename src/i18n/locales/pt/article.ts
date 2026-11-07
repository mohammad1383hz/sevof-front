import type en from "../en/article";

const article: typeof en = {
  "words": {
    "one": "{count} palavra",
    "other": "{count} palavras"
  },
  "actions": {
    "chat": "Conversar",
    "save": "Salvar"
  },
  "steps": {
    "brief": "Briefing",
    "briefHint": "Pesquisa de público e concorrência",
    "outline": "Estrutura",
    "outlineHint": "Planejando o esqueleto",
    "sections": "Redação",
    "sectionsHint": "Seção por seção",
    "meta": "Metadados e SEO",
    "metaHint": "Título, resumo e schema de FAQ",
    "review": "Revisão de SEO",
    "reviewHint": "Verificação e nota",
    "done": "Artigo final",
    "doneHint": "Pronto para publicar"
  },
  "status": {
    "generated": "Pronto",
    "pending": "Aguardando"
  },
  "sectionType": {
    "introduction": "Introdução",
    "section": "Seção principal",
    "faq": "Perguntas frequentes",
    "conclusion": "Conclusão"
  },
  "breakdown": {
    "intent_match": "Alinhamento com a intenção de busca",
    "keyword_usage": "Uso de palavras-chave",
    "entity_coverage": "Cobertura do tema",
    "completeness": "Completude",
    "readability": "Legibilidade",
    "structure": "Estrutura"
  },
  "target": {
    "title": "Título do artigo",
    "meta_title": "Título de SEO",
    "meta_description": "Meta description",
    "excerpt": "Resumo",
    "general": "Artigo inteiro",
    "section": "Seção",
    "faq": "FAQ",
    "article": "Artigo inteiro",
    "metaTitleLong": "Título de SEO (meta title)",
    "metaDescriptionLong": "Meta description",
    "excerptLong": "Resumo",
    "question": "Pergunta {index}"
  },
  "models": {
    "choose": "Escolha um modelo de IA",
    "upgrade": "Faça upgrade do plano para liberar os modelos Pro.",
    "nano": "Rápido e econômico",
    "mini": "Mais preciso para edições complexas",
    "luna": "A melhor qualidade de texto e o tom mais natural — nossa recomendação para os melhores resultados."
  },
  "imageModels": {
    "flux": "Rápido e acessível — ótimo para imagens do dia a dia nos artigos.",
    "banana": "Visual caprichado, ideal para imagens criativas e variadas.",
    "gpt": "Segue o seu prompt à risca e acerta nos detalhes."
  },
  "styles": {
    "minimal": "Minimalista",
    "infographic": "Infográfico",
    "conceptual": "Conceitual",
    "realistic": "Realista",
    "product": "Produto"
  },
  "editor": {
    "placeholder": "Escreva ou edite esta seção…"
  },
  "copy": {
    "failed": "Não deu para copiar.",
    "failedRetry": "Não deu para copiar. Tente novamente."
  },
  "errors": {
    "request": "A solicitação não foi concluída.",
    "invalidResponse": "O servidor enviou uma resposta inesperada."
  },
  "error": {
    "paused": "A escrita do artigo foi pausada",
    "pausedCredit": "Escrita pausada — seus créditos acabaram",
    "savedCredit": "Fique tranquilo: tudo o que já ficou pronto está salvo. Assim que você recarregar, ela continua de onde parou.",
    "savedRetry": "Fique tranquilo: tudo o que já ficou pronto está salvo. Tente de novo e ela continua de onde parou.",
    "buyCredits": "Comprar ou renovar créditos",
    "resume": "Retomar a escrita"
  },
  "seo": {
    "title": "Revisão de SEO",
    "evaluating": "Comparando o artigo completo com o briefing…",
    "failed": "A revisão de SEO não foi concluída (seu artigo está pronto, só que sem nota).",
    "outOf100": "de 100",
    "overall": "Nota geral de SEO",
    "suggestions": "Como melhorar"
  },
  "image": {
    "featured": "Imagem de destaque",
    "failed": "A geração da imagem falhou",
    "noBlock": "Sem problema — isso não impede que o texto seja escrito ou publicado.",
    "creating": "A IA está escrevendo um prompt e criando sua imagem de destaque…",
    "tip": "Para imagens de mais qualidade, experimente o GPT Image ou o Nano Banana",
    "generating": "Criando uma nova imagem…",
    "generatingShort": "Gerando…",
    "closeEditor": "Fechar editor",
    "retryPrompt": "Tentar de novo com outro prompt",
    "editPrompt": "Editar prompt e gerar de novo",
    "promptPlaceholder": "Descreva a imagem que você quer…",
    "modelLocked": "O modelo “{model}” é exclusivo para usuários Pro. Levando você para os planos…",
    "editLocked": "Editar e gerar imagens de novo é um recurso Pro. Levando você para os planos…",
    "promptShort": "Esse prompt está curto demais.",
    "assistant": "Assistente de imagem — edite o prompt e envie",
    "proOnly": "Editar o prompt e gerar a imagem de novo está disponível no Pro.",
    "introExisting": "Este foi o prompt usado na imagem. Mude como quiser:",
    "introNew": "Ainda não há prompt. Escreva um para gerar a imagem:",
    "submit": "Gerar de novo",
    "proOnlyShort": "Só no Pro"
  },
  "meta": {
    "title": "Configurações de SEO",
    "empty": "vazio",
    "focusKeyword": "Palavra-chave em foco",
    "slug": "Slug da URL",
    "slugHint": "A parte do endereço que forma a URL — só letras minúsculas e hifens",
    "ogTitle": "Título para redes sociais (og:title)",
    "ogDescription": "Descrição para redes sociais (og:description)"
  },
  "faq": {
    "title": "Perguntas frequentes",
    "count": {
      "one": "{count} pergunta",
      "other": "{count} perguntas"
    },
    "question": "Pergunta",
    "answer": "Resposta",
    "saveFailed": "Não conseguimos salvar esta pergunta."
  },
  "sections": {
    "title": "Seções do artigo",
    "designing": "Montando a estrutura a partir do briefing…",
    "none": "A estrutura ainda não foi criada.",
    "editManually": "Editar manualmente",
    "progress": "{done} de {total} seções",
    "regenerate": "Reescrever esta seção"
  },
  "banner": {
    "title": "Banner do artigo",
    "designing": "Criando seu banner…",
    "failed": "Não deu para gerar o banner de novo.",
    "failedRetry": "Não deu para gerar o banner de novo. Tente novamente.",
    "generationFailed": "A criação do banner falhou.",
    "regenerate": "Gerar de novo"
  },
  "brief": {
    "title": "Briefing do artigo",
    "analyzing": "A IA está estudando seu público, a intenção de busca e as lacunas no conteúdo dos concorrentes…",
    "notYet": "Ainda não criado.",
    "audience": "Público",
    "tone": "Tom",
    "length": "Tamanho alvo",
    "goal": "Objetivo do artigo",
    "mustCover": "Temas obrigatórios",
    "gaps": "Lacunas dos concorrentes (sua vantagem)",
    "linkPlan": "“{anchor}” na seção “{section}”"
  },
  "chat": {
    "title": "Converse com a IA",
    "selectSection": "Escolha uma seção",
    "or": "ou",
    "orDrag": "ou arraste uma seção para cá",
    "selectAll": "selecione o artigo inteiro",
    "useSelect": "Escolha uma seção em “Selecionar seção”",
    "drop": "Solte para conversar sobre esta seção",
    "dropHere": "Solte aqui para adicionar à conversa",
    "loading": "Carregando conversa…",
    "empty": "Ainda não há conversas sobre este artigo.",
    "applied": "Aplicado",
    "clearTarget": "Remover",
    "placeholder": "ex.: Deixe esta seção mais formal e objetiva…",
    "placeholderShort": "ex.: Deixe esta seção mais formal…",
    "placeholderEmpty": "Escolha primeiro uma seção do artigo ou solte-a aqui",
    "selectFirst": "Escolha uma seção primeiro",
    "disabledUntilDone": "A conversa abre quando o artigo estiver pronto…",
    "waitForArticle": "Escrevendo o artigo… A conversa abre assim que ele ficar pronto",
    "noCredits": "Seu plano não está ativo ou seus créditos acabaram.",
    "sendFailed": "Sua mensagem não foi enviada. Tente novamente.",
    "sendAria": "Enviar mensagem",
    "previous": "Conversas anteriores sobre este artigo ({count})",
    "loadingPrevious": "Carregando conversas anteriores…",
    "firstDraft": "Primeiro rascunho",
    "draft": "Rascunho {index}",
    "withAgent": "Conversar com o agente"
  },
  "final": {
    "article": "Artigo",
    "ready": "Seu artigo está pronto",
    "section": "Seção {index}",
    "waiting": "Aguardando",
    "sectionFailed": "Não foi possível escrever esta seção.",
    "sectionTitle": "Título da seção",
    "saveFailed": "Não conseguimos salvar o artigo.",
    "dragToChat": "Arraste para a conversa",
    "dragShort": "Arrastar para a conversa",
    "dragArticle": "Arraste o artigo inteiro para a conversa",
    "dragSection": "Arraste esta seção para a conversa",
    "chatArticle": "Conversar sobre o artigo inteiro",
    "editArticle": "Editar o artigo inteiro",
    "copyMarkdown": "Copiar como Markdown"
  },
  "modal": {
    "title": "Escolha como seu artigo será escrito",
    "subtitle": "O modelo escolhido define a qualidade e o SEO do artigo. Os modelos mais avançados vêm com o Pro.",
    "writingModel": "Modelo de escrita",
    "writingModelDesc": "Este modelo escreve o texto e a estrutura do artigo.",
    "images": "Imagens do artigo",
    "imagesDesc": "Escolha o modelo de imagem e quantas imagens criar para este artigo.",
    "qualityTip": "Para a melhor qualidade, use o GPT Image ou o Nano Banana",
    "imageCount": "Número de imagens",
    "upToImages": "Crie até {count} imagens",
    "firstImage": "A primeira imagem vira a imagem de destaque.",
    "sectionCount": "Número de seções",
    "rangePro": "Esta faixa está disponível no Pro",
    "sectionRange": "Seu artigo terá de {min} a {max} seções.",
    "advanced": "Avançado (opcional)",
    "advancedHint": "Estilo de imagem e instruções próprias para o texto e a imagem de destaque",
    "imageStyle": "Estilo de imagem",
    "infographicHint": "Infográficos exigem o GPT Image ou o Nano Banana",
    "articlePromptPlaceholder": "ex.: Tom de conversa, para iniciantes, com uma conclusão clara",
    "imagePromptPlaceholder": "ex.: Uma mesa de madeira com notebook e uma xícara de café na luz suave da manhã",
    "imagePromptHint": "O estilo escolhido acima também vale para esta imagem — sem textos nem logos.",
    "start": "Começar a escrever"
  },
  "publish": {
    "connect": "Conectar {platform}",
    "notConnected": "Seu site ainda não está conectado ao {platform}.",
    "publishTo": "Publicar no {platform}",
    "updateOn": "Atualizar no {platform}",
    "removeFrom": "Remover do {platform}",
    "draftOn": "Rascunho no {platform}",
    "viewOn": "Ver no {platform}",
    "checking": "Verificando a conexão…",
    "finishFirst": "O artigo precisa estar pronto antes de ser publicado.",
    "whenReady": "Você pode publicar assim que o artigo ficar pronto.",
    "publishing": "Publicando…",
    "publish": "Publicar",
    "updating": "Atualizando…",
    "updated": "Atualizado",
    "update": "Atualizar",
    "deleting": "Removendo…",
    "confirmDelete": "Tem certeza? Clique de novo"
  },
  "page": {
    "missingId": "Está faltando o ID da ideia ou do artigo.",
    "startFailed": "Não conseguimos começar a escrever o artigo.",
    "noId": "O servidor não retornou um ID de artigo.",
    "startError": "Algo deu errado ao começar o artigo.",
    "retryFailed": "A nova tentativa não funcionou. Tente novamente.",
    "regenFailed": "Não conseguimos reescrever esta seção.",
    "regenFailedRetry": "Não conseguimos reescrever esta seção. Tente novamente.",
    "wpPublishFailed": "A publicação no WordPress falhou.",
    "wpPublishFailedRetry": "A publicação no WordPress falhou. Tente novamente.",
    "wpUpdateFailed": "A atualização no WordPress falhou.",
    "wpUpdateFailedRetry": "A atualização no WordPress falhou. Tente novamente.",
    "wpDeleteFailed": "A remoção do WordPress falhou.",
    "wpDeleteFailedRetry": "A remoção do WordPress falhou. Tente novamente.",
    "checkingPlan": "Verificando seu plano…",
    "preparing": "Preparando seu artigo…",
    "autoRefresh": "Esta página se atualiza sozinha — não precisa recarregar."
  }
};

export default article;
