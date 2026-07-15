import { z } from 'zod';

export const signUpSchema = z
  .object({
    name: z.string().trim().min(2, 'El nombre es obligatorio').max(100, 'No puede superar 100 caracteres'),
    lastname: z.string().trim().min(2, 'El apellido es obligatorio').max(100, 'No puede superar 100 caracteres'),
    email: z
      .string()
      .min(1, 'El correo electrónico es requerido')
      .email('Correo electrónico inválido')
      .max(320, 'El correo no puede superar 320 caracteres')
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(8, 'Debe tener al menos 8 caracteres')
      .max(256, 'No puede superar 256 caracteres')
      .regex(/[A-Z]/, 'Debe contener una letra mayúscula')
      .regex(/[0-9]/, 'Debe contener un número'),
    repeatPassword: z.string().min(1, 'Debes repetir la contraseña'),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['repeatPassword'],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
