import { z } from 'zod'

export const signInSchema = z.object({
    email: z
        .string()
        .min(1, 'El correo electrónico es requerido')
        .email('Correo electrónico inválido')
        .toLowerCase()
        .trim(),
    
    password: z
        .string()
        .min(1, 'La contraseña es requerida')
        .min(8, 'Debe tener al menos 8 caracteres')
})

export type SignInFormData = z.infer<typeof signInSchema>