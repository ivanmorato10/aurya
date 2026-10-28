import { z } from "zod";
import { CATEGORY_IDS } from "./categories";
import { MOMENT_IDS, isValidSchedule, isValidTimeZone, parseTime } from "./schedule";

const time = z.string().refine((v) => parseTime(v) !== null, "Informe um horário válido.");

export const scheduleSchema = z
  .object({
    timeZone: z.string().refine(isValidTimeZone, "Escolha um fuso horário válido."),
    wake: time,
    commute: time,
    midday: time,
    sleep: time,
  })
  .superRefine((value, ctx) => {
    if (MOMENT_IDS.every((id) => parseTime(value[id]) !== null) && !isValidSchedule(value)) {
      ctx.addIssue({ code: "custom", path: ["schedule"], message: "Use quatro horários diferentes." });
    }
  });

export const messagesSchema = z.object({
  types: z
    .array(z.enum(CATEGORY_IDS))
    .min(1, "Escolha pelo menos um tipo de mensagem.")
    .transform((v) => [...new Set(v)]),
  includeQuotes: z.boolean(),
});

export const nameSchema = z.object({
  displayName: z
    .string()
    .trim()
    .max(60, "Use até 60 caracteres.")
    .transform((v) => (v === "" ? null : v)),
});

export const onboardingSchema = z.object({
  schedule: scheduleSchema,
  messages: messagesSchema,
  name: nameSchema,
});

export const emailSchema = z.string().trim().toLowerCase().max(254).email("Informe um e-mail válido.");

// O Supabase permite códigos de 6 a 10 dígitos conforme a configuração do projeto.
export const otpSchema = z
  .string()
  .trim()
  .regex(/^\d{6,10}$/, "O código tem apenas números. Confira o e-mail recebido.");

/** Aceita somente caminhos internos, para evitar redirecionamento aberto. */
export function safeNextPath(value: unknown, fallback = "/hoje"): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }
  return value;
}
