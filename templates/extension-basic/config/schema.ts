import { z } from 'zod';

export const TemplateBasicConfigSchema = z.object({
  enabled: z.boolean().default(true),
  greeting: z.string().default('hello from template-basic'),
});

export type TemplateBasicConfig = z.infer<typeof TemplateBasicConfigSchema>;
