import { decode } from 'jsonwebtoken'
import { createLogger } from '../utils/logger.mjs'

const logger = createLogger('auth-utils')

/**
 * Extract user id from an API Gateway event (Authorization header)
 * @param event API Gateway event
 * @returns user id (sub) from the JWT token
 */
export function getUserId(event) {
    const authHeader = event.headers.Authorization || event.headers.authorization

    if (!authHeader) {
        logger.error('No authentication header')
        throw new Error('No authentication header')
    }

    if (!authHeader.toLowerCase().startsWith('bearer ')) {
        logger.error('Invalid authentication header', { authHeader })
        throw new Error('Invalid authentication header')
    }

    const split = authHeader.split(' ')
    const token = split[1]

    return parseUserId(token)
}

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken) {
    const decodedJwt = decode(jwtToken)
    return decodedJwt.sub
}
