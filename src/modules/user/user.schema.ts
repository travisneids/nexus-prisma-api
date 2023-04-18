import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod'

const userBase = {
    email: z.string({
        required_error: 'You must provide an email address',
        invalid_type_error: 'Email must be a string'
    }).email(),
}

const profileBase = {
    name: z.string(),
    displayName: z.string()
}

const createUserSchema = z.object({
    ...userBase,
    password: z.string({
        required_error: 'You must provide a password',
        invalid_type_error: 'Password must be a string'
    }),
    ...profileBase
})

const createUserResponseSchema = z.object({
    id: z.number(),
    ...userBase, 
})

const updateUserSchema = z.object({
    name: z.string().nullable(),
    displayName: z.string().nullable()
})

const updateUserResponseSchema = z.object({
    id: z.number(),
    ...profileBase
})

const userSchema = z.object({
    id: z.number(),
})

const loginSchema = z.object({
    email: z.string({
        required_error: 'You must provide an email address',
        invalid_type_error: 'Email must be a string'
    }).email(),
    password: z.string()
})

const loginResponseSchema = z.object({
    accessToken: z.string(),
})

const loginEventGenerated = {
    ip: z.string(),
    session: z.string(),
}

const createLoginEventSchema = z.object({
    ...loginEventGenerated
})

export type CreateLoginEventInput = z.infer<typeof createLoginEventSchema>

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UserInput = z.infer<typeof userSchema>

export const { schemas: userSchemas, $ref } = buildJsonSchemas({
    createUserSchema,
    createUserResponseSchema,
    updateUserSchema,
    updateUserResponseSchema,
    userSchema,
    loginSchema,
    loginResponseSchema,
    createLoginEventSchema
})
