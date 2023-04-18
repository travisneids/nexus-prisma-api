import Fastify, { FastifyReply, FastifyRequest } from 'fastify'
import fastifyEnv from '@fastify/env'
import FastifyJwt from '@fastify/jwt'
import userRoutes from './modules/user/user.route'
import { userSchemas } from './modules/user/user.schema'

export const fastify = Fastify()

declare module 'fastify' {
    export interface FastifyInstance {
        auth: any;
        config: any;
    }
}

const envOptions = {
    confKey: 'config',
    schema: {
        type: 'object',
        required: ['PORT', 'HOST', 'SECRET_HASH'],
        properties: {
            PORT: {
                type: 'string',
                default: 3000
            },
            HOST: {
                type: 'string',
                default: '0.0.0.0'
            },
            SECRET_HASH: {
                type: 'string'
            }
        }
    },
    dotenv: true,
    data: process.env
}

fastify.get('/healthcheck', async function (req: FastifyRequest) {
    return { status: "OK" }
})

fastify.decorate('auth',
    async (req: FastifyRequest, reply: FastifyReply) => {
        try {
            await req.jwtVerify()
        } catch (e) {
            return reply.send(e)
        }
    })

async function main() {
    fastify.register(fastifyEnv, envOptions)
    await fastify.after()

    for (const schema of [...userSchemas]) {
        fastify.addSchema(schema)
    }

    fastify.register(userRoutes, { prefix: 'api/user' })
    fastify.register(FastifyJwt, {
        secret: fastify.config.SECRET_HASH,
    })

    try {
        const host = fastify.config.HOST
        const port = fastify.config.PORT

        await fastify.listen({ port, host })
        console.log(`Server ready at ${host}:${port}`)
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}

["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, async () => {
        await fastify.close()

        process.exit(0)
    })
})

main()
