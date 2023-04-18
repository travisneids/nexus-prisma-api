import { hashPassword } from '../../utils/hash';
import prisma from '../../utils/prisma';
import { CreateUserInput, UpdateUserInput, CreateLoginEventInput } from './user.schema';

export async function createUser(input: CreateUserInput) {
    const { password, email, ...rest } = input;
    const { hash, salt } = hashPassword(password)

    const user = await prisma.user.create({
        data: {
            email,
            salt,
            password: hash,
            profile: {
                create: {
                    ...rest
                }
            }
        },
    })

    return user
}

export async function updateUser(
    data: UpdateUserInput, userId: number
    ) {
    return await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            ...data
        },
    })
}

export async function findByUserId(id: number) {
    return await prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            email: true,
            profile: true
        }
    })
}

export async function findProfileUserId(id: number) {
    return await prisma.user.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            email: true,
            profile: true
        }
    })
}

export async function findUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: {
            email,
        }
    })
}

export async function findUsers() {
    return prisma.user.findMany({
        select: {
            email: true,
            id: true,
        }
    })
}

export async function createLoginEvent(data: CreateLoginEventInput){
    return prisma.userLoginEvent.create({
        data
    })
}

export function getLoginEvents() {
    return prisma.userLoginEvent.findMany()
}