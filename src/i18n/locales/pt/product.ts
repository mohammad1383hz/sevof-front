import type en from "../en/product";

const product: typeof en = {
  "clearSearch": "Limpar busca",
  "errors": {
    "server": "Não conseguimos falar com o servidor. Tente novamente.",
    "serverShort": "Não conseguimos falar com o servidor."
  },
  "styles": {
    "price": "Preço e orçamento",
    "comparison": "Comparativo de produtos",
    "buying_guide": "Guia de compra"
  },
  "steps": {
    "brief": "Análise e briefing",
    "briefHint": "Estudando produtos e público",
    "plan": "Planejamento",
    "planHint": "Distribuindo produtos pelas seções",
    "sections": "Redação",
    "sectionsHint": "Uma seção de cada vez",
    "written": "{done} de {total} seções escritas"
  },
  "idea": {
    "internalLink": "Link interno",
    "viewProgress": "Ver andamento",
    "generated": "Artigo pronto",
    "failed": "A escrita falhou",
    "viewRetry": "Ver e tentar de novo",
    "paused": "Pausado (sem créditos)"
  },
  "outline": {
    "title": "Estrutura do artigo",
    "building": "Montando a estrutura…",
    "approxWords": "≈ {count} palavras",
    "written": "{done} de {total} escritas",
    "untitled": "Sem título",
    "target": "Meta: {count} palavras",
    "keyPoints": "Pontos-chave",
    "types": {
      "product": "Apresentação do produto",
      "products": "Apresentação dos produtos",
      "comparison": "Comparativo",
      "buyingGuide": "Guia de compra",
      "guide": "Guia"
    }
  },
  "editIdea": {
    "subtitle": "Defina o título, os produtos e o link interno do artigo.",
    "titleHint": "Coloque a palavra-chave principal no início. Títulos com menos de {max} caracteres aparecem inteiros no Google.",
    "products": "Produtos do artigo",
    "needProduct": "Adicione pelo menos um produto.",
    "removeProduct": "Remover {name}",
    "changeProducts": "Adicionar ou trocar produtos",
    "link": "Link interno",
    "linkHint": "O artigo vai linkar para esta página da loja — de preferência a categoria principal desses produtos.",
    "categoriesError": "Não conseguimos carregar suas categorias, então o link atual foi mantido.",
    "missingCategory": "A categoria do link atual não existe mais. Escolha outra.",
    "pickTitle": "Escolha os produtos do artigo",
    "pickSubtitle": "Os produtos que este artigo vai destacar.",
    "pickConfirm": "Usar estes produtos"
  },
  "category": {
    "filterPrefix": "Categoria:",
    "linkPrefix": "Linka para:",
    "all": "Todas as categorias",
    "home": "Página inicial da loja",
    "filterNote": "Escolher uma categoria inclui também os produtos das subcategorias.",
    "linkNote": "O artigo vai linkar para esta página.",
    "none": "Sem categorias",
    "select": "Escolha uma categoria",
    "search": "Buscar categorias",
    "searchPlaceholder": "Buscar categorias…",
    "empty": "Nenhuma categoria encontrada",
    "emptyHint": "Tente outra busca.",
    "collapse": "Ocultar subcategorias",
    "expand": "Mostrar subcategorias",
    "removeFilter": "Remover filtro de categoria",
    "backHome": "Voltar à página inicial da loja"
  },
  "picker": {
    "loadFailed": "Não conseguimos carregar seus produtos.",
    "addFailed": "Não conseguimos adicionar este produto.",
    "alreadySelected": "Este produto já está selecionado.",
    "addedAtLimit": "O produto foi adicionado, mas você chegou ao limite de seleção. Remova um e depois escolha este na lista.",
    "existingSelected": "Este produto já estava no seu catálogo — agora está selecionado.",
    "addedSelected": "Produto adicionado e selecionado.",
    "manualTitle": "Adicionar produto pela URL",
    "manualHint": "Não achou um produto? Cole a URL da página dele para adicionar e selecionar.",
    "manualBody": "Copie a URL da página do produto na sua loja e cole aqui. A gente busca os dados e já seleciona para você.",
    "closeManual": "Fechar",
    "url": "URL do produto",
    "add": "Adicionar",
    "search": "Buscar produtos",
    "searchPlaceholder": "Buscar pelo nome do produto…",
    "selected": "Produtos selecionados",
    "limit": "limite atingido",
    "count": "{count} de {max} selecionados",
    "clear": "Limpar",
    "empty": "Nenhum produto encontrado",
    "emptyHint": "Tente outra busca ou categoria.",
    "more": "Carregar mais produtos"
  },
  "modal": {
    "title": "Escolha como seu artigo de produto será escrito",
    "imageModel": "Modelo da imagem de destaque",
    "featuredImage": "Imagem de destaque",
    "articlePromptPlaceholder": "ex.: Destaque os benefícios do produto, use um tom de conversa e inclua um FAQ no final",
    "imagePromptPlaceholder": "ex.: O produto sobre uma mesa de madeira na luz suave da manhã"
  },
  "body": {
    "saveFailed": "Não foi possível salvar.",
    "product": "Produto",
    "productNumber": "Produto nº {id}",
    "inStock": "Em estoque",
    "outOfStock": "Esgotado",
    "viewProduct": "Ver e comprar",
    "recommended": "Produtos recomendados",
    "seoScore": "Nota de SEO: {score}",
    "writingSection": "Escrevendo esta seção…",
    "noContent": "Nada escrito ainda.",
    "schema": "Schema do produto"
  },
  "seo": {
    "defaultPrompt": "Sugira ideias de artigos de SEO e recomende produtos com base nos mais vendidos e nas categorias principais da loja.",
    "manualPrompt": "Sugira ideias de artigos de SEO para os produtos que eu selecionei.",
    "benefits": {
      "introTitle": "Mostre seus produtos",
      "introText": "Artigos que apresentam seus produtos para quem compra.",
      "googleTitle": "Seja encontrado no Google",
      "googleText": "Traga mais compradores para a sua loja pelas buscas.",
      "salesTitle": "Venda mais",
      "salesText": "Transforme leitores em clientes sem esforço."
    },
    "heroTitle": "Artigos que vendem os produtos de {store}",
    "yourStore": "sua loja",
    "heroBody": "Esta ferramenta sugere e escreve artigos sobre os produtos da sua loja — artigos que apresentam os produtos, trazem compradores do Google e ajudam você a vender mais.",
    "working": "Estou analisando seus produtos e criando ideias. Isso costuma levar menos de um minuto.",
    "editIdea": "Editar ideia (título, produtos, link interno)",
    "backToIdeas": "Voltar às ideias",
    "selectionMethod": "Como escolher os produtos",
    "auto": "Escolher por mim",
    "manual": "Escolher produtos",
    "autoHint": "A gente escolhe os melhores produtos para você.",
    "manualHint": "As ideias vão abordar só os produtos que você escolher.",
    "requestAria": "Pedir ideias de artigos",
    "placeholderManual": "Opcional: que abordagem você quer nos artigos?",
    "placeholderAuto": "Que tipo de artigo você quer? (Deixe em branco que eu sugiro um)",
    "generate": "Gerar ideias",
    "keyHint": "Enter para enviar · Shift+Enter para pular linha",
    "pickTitle": "Escolha produtos para as suas ideias",
    "pickSubtitle": "As ideias de artigos serão criadas só para os produtos escolhidos aqui.",
    "pickConfirm": "Confirmar",
    "selectedCount": {
      "one": "{count} produto selecionado",
      "other": "{count} produtos selecionados"
    },
    "requestIn": "Pedido recebido — suas ideias estão a caminho.",
    "errors": {
      "slow": "As ideias estão demorando mais que o normal. Tente novamente.",
      "open": "Não conseguimos abrir esta conversa.",
      "create": "Não conseguimos iniciar uma nova conversa."
    }
  },
  "page": {
    "preparing": "Preparando seu artigo de produto…"
  }
};

export default product;
