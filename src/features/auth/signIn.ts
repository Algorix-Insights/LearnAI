import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(1, 'La contraseña es requerida')
  .min(8, 'Debe tener al menos 8 caracteres')
  .max(256, 'No puede superar 256 caracteres');

export const signInSchema = z
  .object({
    email: z
      .string()
      .min(1, 'El correo electrónico es requerido')
      .email('Correo electrónico inválido')
      .max(320, 'El correo no puede superar 320 caracteres')
      .toLowerCase()
      .trim(),
    password: passwordSchema,
  });

export type SignInFormData = z.infer<typeof signInSchema>;
