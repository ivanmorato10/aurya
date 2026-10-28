// Tipos de mensagem que a pessoa escolhe. Rótulos e descrições ficam em content/content.json.
export const CATEGORY_IDS = ["prosperidade", "confianca", "proposito", "gratidao"] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];
