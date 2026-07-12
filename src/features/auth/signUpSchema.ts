import { z } from 'zod'

export const signUpSchema = z.object({
    name: z.string().min(2, 'El nombre es obligatorio'),
    lastname: z.string().min(2, 'El apellido es obligatorio'),
    email: z.string().email('Correo electrónico inválido').toLowerCase().trim(),
    password: z
        .string()
        .min(8, 'Debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'Debe contener una letra mayúscula')
        .regex(/[0-9]/, 'Debe contener un número'),
    repeatPassword: z.string(),
}).refine((data) => data.password === data.repeatPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['repeatPassword'],
})

export type SignUpFormData = z.infer<typeof signUpSchema>