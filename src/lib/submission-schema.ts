import { z } from "zod";

/**
 * Zod schema for the Details form (Screen 2).
 * Validates the description field with min/max length constraints.
 * Photo is optional (null or base64 data URL string).
 */
export const detailsFormSchema = z.object({
    description: z
        .string()
        .min(10, "details.minChars")
        .max(2000, "details.maxChars"),
    photo: z.string().nullable().optional(),
});

/** Inferred TypeScript type from the Zod schema */
export type DetailsFormValues = z.infer<typeof detailsFormSchema>;
