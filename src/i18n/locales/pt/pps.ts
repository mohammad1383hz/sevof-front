import type en from "../en/pps";

const pps: typeof en = {
  "title": "SEO de páginas de produto",
  "subtitle": "Escolha produtos e a gente encontra e completa o que está faltando. Você revisa, edita e aprova tudo antes de qualquer coisa ser salva.",
  "fields": {
    "short_description": "Descrição curta",
    "description": "Descrição completa",
    "attributes": "Especificações",
    "tags": "Tags do produto",
    "faq": "Perguntas frequentes",
    "image_alts": "Texto alternativo das imagens",
    "seo_title": "Título de SEO",
    "meta_description": "Meta description",
    "focus_keyword": "Palavra-chave em foco",
    "category_link": "Link para a categoria"
  },
  "status": {
    "pending": "Na fila",
    "analyzing": "Analisando",
    "ready": "Precisa de atenção",
    "skipped": "Tudo certo",
    "approved": "Enviando",
    "published": "Publicado",
    "failed": "Erro"
  },
  "source": {
    "seller": "Dados da sua loja",
    "ai": "Sugestão da IA",
    "user": "Sua edição"
  },
  "stats": {
    "total": "Produtos",
    "issues": "Com pendências"
  },
  "quota": {
    "exhausted": "Você usou todos os créditos do plano grátis",
    "freePlan": "Plano grátis: {count} produtos",
    "used": "{used} de {total} produtos usados",
    "remaining": "restam {count}",
    "upgrade": "Faça upgrade para o Pro e otimize até {count} produtos de uma vez.",
    "upgradeMore": "Faça upgrade para o Pro para selecionar mais",
    "selectionsUsed": "Você usou todas as seleções do plano grátis.",
    "selectMore": "Você ainda pode selecionar {count} produtos no plano grátis.",
    "perBatch": "Até {count} produtos por vez."
  },
  "results": "Resultados",
  "processing": "Processando",
  "selectAllIssues": "Selecionar tudo o que precisa de atenção",
  "selectProduct": "Selecionar {name}",
  "deletedProduct": "Produto excluído",
  "notFound": "{field} não encontrado",
  "missing": "Falta {field}",
  "review": "Revisar e corrigir",
  "clearSelection": "Limpar seleção",
  "start": "Começar a otimizar",
  "selectAll": "Selecionar tudo",
  "deselectAll": "Desmarcar tudo",
  "noProducts": "Nenhum produto sincronizado ainda.",
  "showMore": "Mostrar mais",
  "preview": "Prévia",
  "issuesFound": "O que falta neste produto",
  "aiNotice": "Este conteúdo foi sugerido pela IA e pode ter erros. Revise antes de aprovar e use “Editar” para mudar o que quiser.",
  "sellerInput": "Só você pode preencher estes campos",
  "verifyNumbers": "Confira estes números",
  "verifyNumbersBody": "Estes números aparecem no texto, mas não nos dados atuais do produto:",
  "selectAllFields": "Selecionar todos os campos",
  "suggested": "Sugerido",
  "current": "Atual",
  "edited": "Editado",
  "unsaved": "Não salvo",
  "restore": "Restaurar",
  "cancelEdit": "Cancelar edição",
  "unsavedHint": "Você tem alterações não salvas — elas serão salvas automaticamente quando clicar em “Corrigir no seu site”.",
  "approvedOnly": "Só os campos aprovados serão atualizados no seu produto.",
  "saveEdits": "Salvar alterações ({count})",
  "fixOnSite": "Corrigir no seu site",
  "confirmDiscard": "Suas alterações não salvas serão perdidas. Continuar?",
  "noAttributes": "Nenhuma especificação ainda.",
  "attrName": "Nome",
  "attrNameAria": "Nome da especificação",
  "attrValue": "Valor",
  "attrValueAria": "Valor da especificação",
  "removeAttr": "Remover especificação",
  "addAttr": "Adicionar especificação",
  "tagsPlaceholder": "Separe as tags com vírgula",
  "tagsHint": "Suas tags atuais continuam; estas serão adicionadas a elas.",
  "removeQuestion": "Remover pergunta",
  "addQuestion": "Adicionar pergunta",
  "altAria": "Texto alternativo da imagem {index}",
  "altHint": "Enviado só para imagens que ainda não têm texto alternativo. Os textos alternativos que já existem no seu site não mudam.",
  "formatHint": "Deixe uma linha em branco entre os parágrafos. Títulos: “## Título” ou “### Título” · Listas: “- Item”",
  "bulk": {
    "sending": "Enviando {done} de {total}",
    "fixSelected": "Corrigir os selecionados no seu site",
    "done": {
      "one": "{count} produto aprovado e a caminho do seu site",
      "other": "{count} produtos aprovados e a caminho do seu site"
    },
    "failed": "{count} com falha",
    "more": "…e mais {count}",
    "confirmTitle": "Aplicar todas as correções de uma vez?",
    "confirmBody": "Todos os campos sugeridos destes {count} produtos — descrições, especificações, tags, FAQ, textos alternativos e configurações de SEO — vão direto para o seu site, sem revisão individual. Como o conteúdo é gerado por IA, recomendamos revisar pelo menos alguns em “Revisar e corrigir”.",
    "confirm": "Confirmar e enviar"
  },
  "validation": {
    "attr": "Cada especificação precisa de nome e valor.",
    "empty": "“{field}” não pode ficar vazio.",
    "tagsMax": "Você pode adicionar até {max} tags.",
    "tagLength": "Cada tag pode ter até {max} caracteres.",
    "faq": "Cada item do FAQ precisa de pergunta e resposta.",
    "faqLength": "As perguntas podem ter até {q} caracteres e as respostas até {a}.",
    "altEmpty": "O texto alternativo não pode ficar vazio.",
    "altLength": "O texto alternativo de cada imagem pode ter até {max} caracteres.",
    "maxLength": "“{field}” pode ter até {max} caracteres."
  },
  "errors": {
    "results": "Não conseguimos carregar os resultados de SEO.",
    "products": "Não conseguimos carregar seus produtos.",
    "start": "Não conseguimos iniciar a otimização.",
    "preview": "Não conseguimos carregar a prévia.",
    "noFields": "Não há campos para enviar.",
    "restore": "Não foi possível restaurar.",
    "noneSelected": "Nenhum campo selecionado.",
    "submit": "Não conseguimos enviar as alterações."
  }
};

export default pps;
