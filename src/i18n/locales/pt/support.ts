import type en from "../en/support";

const support: typeof en = {
  "newTicket": "Novo chamado",
  "backToTickets": "Voltar aos chamados",
  "empty": "Nenhum chamado ainda. Use o botão acima para abrir o primeiro.",
  "messages": {
    "one": "{count} mensagem",
    "other": "{count} mensagens"
  },
  "attachment": "Anexo {index}",
  "attachedImage": "Imagem anexada",
  "fullImage": "Imagem em tamanho real",
  "closedNotice": "Este chamado foi encerrado. Abra um novo se precisar de ajuda com outra coisa.",
  "status": {
    "open": "Aguardando nossa resposta",
    "answered": "Respondido",
    "closed": "Encerrado"
  },
  "topics": {
    "wordpress": "Plugin do WordPress",
    "api": "API",
    "bug": "Algo não está funcionando",
    "billing": "Cobrança e pagamentos"
  },
  "priority": {
    "low": "Baixa",
    "normal": "Normal",
    "high": "Alta"
  },
  "form": {
    "topic": "Como podemos ajudar?",
    "subjectPlaceholder": "…ou escreva seu próprio assunto",
    "description": "Detalhes",
    "descriptionPlaceholder": "Conte para a gente o que está acontecendo…",
    "phone": "Celular",
    "phoneHint": "Para nossa equipe falar com você sobre este chamado.",
    "image": "Captura de tela (opcional)",
    "addImage": "Adicionar imagem",
    "imagesSelected": "{count}/{max} imagens selecionadas",
    "priority": "Prioridade",
    "submit": "Enviar chamado"
  },
  "reply": {
    "send": "Enviar",
    "sendReply": "Enviar resposta",
    "messagePlaceholder": "Escreva sua mensagem…",
    "replyPlaceholder": "Escreva sua resposta…",
    "staff": "Suporte",
    "you": "Você",
    "photo": "Imagem",
    "close": "Encerrar chamado",
    "closing": "Encerrando…"
  },
  "errors": {
    "load": "Não conseguimos carregar seus chamados.",
    "loadNetwork": "Problema de conexão ao carregar seus chamados.",
    "imagesOnly": "Só é possível anexar imagens.",
    "tooLarge": "“{name}” tem mais de 4 MB.",
    "tooMany": "Você pode anexar até {max} imagens.",
    "subjectRequired": "Informe um assunto.",
    "subjectMin": "O assunto precisa ter pelo menos {min} caracteres.",
    "subjectMax": "O assunto pode ter no máximo {max} caracteres.",
    "messageRequired": "Descreva o seu problema.",
    "messageMin": "Os detalhes precisam ter pelo menos {min} caracteres.",
    "messageMax": "Os detalhes podem ter no máximo {max} caracteres.",
    "phone": "Digite um celular válido (ex.: 09xxxxxxxxx).",
    "submit": "Não conseguimos enviar seu chamado.",
    "submitNetwork": "Problema de conexão ao enviar seu chamado.",
    "notFound": "Chamado não encontrado.",
    "ticketNetwork": "Problema de conexão ao carregar este chamado.",
    "reply": "Não conseguimos enviar sua resposta.",
    "replyNetwork": "Problema de conexão ao enviar sua resposta."
  }
};

export default support;
