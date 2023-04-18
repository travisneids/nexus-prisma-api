import argon2 from 'argon2'

export async function hashPassword(password: string) {
    const hash = await argon2.hash(password)

    return { hash }
}

export async function verifyPassword({
    candidatePassword,
    hash
}: {
    candidatePassword: string
    hash: string
}) {
    try {
        return await argon2.verify(hash, candidatePassword)
    } catch(e) {
        console.log(`Could not validate the password`)

        return false
    }
}
