import { z } from 'zod';

import { STOP_REASON_VALUES } from './constants';
import { validateUntil } from './time';

const reasonSchema = z
  .union([z.enum(STOP_REASON_VALUES), z.literal('')])
  .refine((value): value is (typeof STOP_REASON_VALUES)[number] => value !== '', {
    message: 'Выберите причину стопа',
  });

export const stopItemSchema = z
  .object({
    reason: reasonSchema,
    until: z.string().nullable(),
  })
  .superRefine((value, ctx) => {
    const error = validateUntil(value.until);
    if (error) {
      ctx.addIssue({ code: 'custom', path: ['until'], message: error });
    }
  });

export type StopItemFormInput = z.input<typeof stopItemSchema>;
export type StopItemFormValues = z.output<typeof stopItemSchema>;
