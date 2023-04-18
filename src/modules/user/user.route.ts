import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { updateUserHandler, getProfileHandler, loginHandler, registerUserHandler } from './user.controller';
import { $ref } from './user.schema';

async function userRoutes(fastify: FastifyInstance) {
    fastify.post('/', {
        schema: {
            body: $ref('createUserSchema'),
            response: {
                201: $ref('createUserResponseSchema')
            }
        }
    },
        registerUserHandler)

    fastify.post('/login', {
        schema: {
            body: $ref('loginSchema'),
            response: {
                200: $ref('loginResponseSchema')
            }
        }
    }, loginHandler)

    fastify.patch('/', {
        schema: {
            body: $ref('updateUserSchema'),
            response: {
                201: $ref('updateUserResponseSchema')
            }
        },
        preHandler: [fastify.auth],
    }, updateUserHandler)

    fastify.get(
        "/",
        {
            preHandler: [fastify.auth],
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            reply.send(req.user)
        }
    );

    fastify.get(
        "/:id/profile",
        {
            preHandler: [fastify.auth],
        },
        getProfileHandler
    )
}

export default userRoutes
