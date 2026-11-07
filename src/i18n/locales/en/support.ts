import { plural } from "../../plural";

const support = {
  "newTicket": "New ticket",
  "backToTickets": "Back to tickets",
  "empty": "No tickets yet. Use the button above to open your first one.",
  "messages": plural({"one":"{count} message","other":"{count} messages"}),
  "attachment": "Attachment {index}",
  "attachedImage": "Attached image",
  "fullImage": "Full-size image",
  "closedNotice": "This ticket is closed. Open a new ticket if you need help with something else.",
  "status": {
    "open": "Waiting for our reply",
    "answered": "Answered",
    "closed": "Closed"
  },
  "topics": {
    "wordpress": "WordPress plugin",
    "api": "API",
    "bug": "Something's broken",
    "billing": "Billing & payments"
  },
  "priority": {
    "low": "Low",
    "normal": "Normal",
    "high": "High"
  },
  "form": {
    "topic": "What do you need help with?",
    "subjectPlaceholder": "…or type your own subject",
    "description": "Details",
    "descriptionPlaceholder": "Tell us what's going on…",
    "phone": "Mobile number",
    "phoneHint": "So our team can reach you about this ticket.",
    "image": "Screenshot (optional)",
    "addImage": "Add image",
    "imagesSelected": "{count}/{max} images selected",
    "priority": "Priority",
    "submit": "Send ticket"
  },
  "reply": {
    "send": "Send",
    "sendReply": "Send reply",
    "messagePlaceholder": "Write your message…",
    "replyPlaceholder": "Write your reply…",
    "staff": "Support",
    "you": "You",
    "photo": "Image",
    "close": "Close ticket",
    "closing": "Closing…"
  },
  "errors": {
    "load": "We couldn't load your tickets.",
    "loadNetwork": "Network problem while loading your tickets.",
    "imagesOnly": "Only image files can be attached.",
    "tooLarge": "“{name}” is bigger than 4 MB.",
    "tooMany": "You can attach up to {max} images.",
    "subjectRequired": "Please add a subject.",
    "subjectMin": "The subject needs at least {min} characters.",
    "subjectMax": "The subject can be at most {max} characters.",
    "messageRequired": "Please describe your issue.",
    "messageMin": "The details need at least {min} characters.",
    "messageMax": "The details can be at most {max} characters.",
    "phone": "Please enter a valid mobile number (e.g. 09xxxxxxxxx).",
    "submit": "We couldn't send your ticket.",
    "submitNetwork": "Network problem while sending your ticket.",
    "notFound": "Ticket not found.",
    "ticketNetwork": "Network problem while loading this ticket.",
    "reply": "We couldn't send your reply.",
    "replyNetwork": "Network problem while sending your reply."
  }
};

export default support;
