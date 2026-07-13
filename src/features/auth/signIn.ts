import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(1, 'La contraseña es requerida')
  .min(8, 'Debe tener al menos 8 caracteres')
  .max(256, 'No puede superar 256 caracteres');

export const signInSchema = z
  .object({
    mode: z.enum(['password', 'otp']),
    email: z
      .string()
      .min(1, 'El correo electrónico es requerido')
      .email('Correo electrónico inválido')
      .max(320, 'El correo no puede superar 320 caracteres')
      .toLowerCase()
      .trim(),
    password: z.string().optional(),
  })
  .superRefine((data, context) => {
    if (data.mode !== 'password') return;

    const result = passwordSchema.safeParse(data.password ?? '');
    if (!result.success) {
      for (const issue of result.error.issues) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: issue.message,
          path: ['password'],
        });
      }
    }
  });

export type SignInFormData = z.infer<typeof signInSchema>;
