import { FastifyReply, FastifyRequest } from 'fastify';
import { createLoginEvent, createUser, findProfileUserId, findUserByEmail, findUsers, updateUser, } from './user.service';
import { CreateUserInput, LoginInput, UpdateUserInput, UserInput } from './user.schema';
import { verifyPassword } from '../../utils/hash';
import { fastify } from '../../app';

export async function registerUserHandler(
    req: FastifyRequest<{
        Body: CreateUserInput
    }>,
    reply: FastifyReply) {
    const body = req.body

    try {
        const user = await createUser(body)

        return reply.code(201).send(user)
    } catch (e) {
        console.log(e)

        return reply.code(500).send(e)
    }
}

export async function updateUserHandler(
    req: FastifyRequest<{
        Body: UpdateUserInput
    }>, reply: FastifyReply
) {    
    try {
        const user = await updateUser(req.body, 8)

        return reply.code(201).send(user)
    } catch (e) {
        console.log(e)

        return reply.code(500).send(e)
    }
}

export async function getProfileHandler(req: FastifyRequest<{
    Params: UserInput
}>) {
    const params = req.params
    const user = await findProfileUserId(Number(params.id))

    return user
}

export async function loginHandler(req: FastifyRequest<{
    Body: LoginInput
}>,
    reply: FastifyReply) {

    const body = req.body
    const user = await findUserByEmail(body.email)

    if (!user) {
        return reply.code(401).send({
            message: 'Email and password combindation is invalid'
        })
    }

    const correctPassword = verifyPassword({
        candidatePassword: body.password,
        salt: user.salt,
        hash: user.password
    })

    if (correctPassword) {
        const { password, salt, ...rest } = user

        const event = await createLoginEvent({
            ip: req.ip,
            session: req.headers['user-agent'] || '',
        })

        return { accessToken: fastify.jwt.sign(rest) }
    }

    return reply.code(401).send({
        message: 'Email and password combindation is invalid'
    })
}

export async function getUsersHandler() {
    const users = await findUsers()

    return users
}
