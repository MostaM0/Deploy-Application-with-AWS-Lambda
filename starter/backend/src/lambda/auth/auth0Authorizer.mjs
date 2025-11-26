import Axios from 'axios'
import jsonwebtoken from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.mjs'

const logger = createLogger('auth')

const jwksUrl =
    process.env.AUTH_0_JWKS_URL

let cachedKeys = null

export async function handler(event) {
    logger.info('Authorizing a user', { authorizationToken: event.authorizationToken })

    try {
        const jwtToken = await verifyToken(event.authorizationToken)

        logger.info('User was authorized', { userId: jwtToken.sub })

        return {
            principalId: jwtToken.sub,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*'
                    }
                ]
            }
        }
    } catch (e) {
        logger.error('User not authorized', { error: e.message })

        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        }
    }
}

async function verifyToken(authHeader) {
    const token = getToken(authHeader)

    const jwt = jsonwebtoken.decode(token, { complete: true })

    if (!jwt || !jwt.header || !jwt.header.kid) {
        throw new Error('Invalid JWT token')
    }

    const kid = jwt.header.kid
    logger.info('Verifying token with kid', { kid })

    const signingKeys = await getSigningKeys()
    const signingKey = signingKeys.find(key => key.kid === kid)

    if (!signingKey) {
        throw new Error(`Unable to find a signing key that matches '${kid}'`)
    }

    if (!signingKey.x5c || !signingKey.x5c[0]) {
        throw new Error('Signing key does not contain a valid x5c certificate')
    }

    const cert = convertCertToPEM(signingKey.x5c[0])

    const verifiedToken = jsonwebtoken.verify(token, cert, {
        algorithms: ['RS256']
    })

    return verifiedToken
}

async function getSigningKeys() {
    if (cachedKeys) {
        logger.info('Using cached JWKS keys')
        return cachedKeys
    }

    logger.info('Fetching JWKS from Auth0', { jwksUrl })

    const response = await Axios.get(jwksUrl)
    const jwks = response.data

    if (!jwks.keys || !jwks.keys.length) {
        throw new Error('No JWKS keys found in the response')
    }

    cachedKeys = jwks.keys
    logger.info('JWKS keys fetched and cached')

    return cachedKeys
}

function convertCertToPEM(cert) {
    return `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`
}

function getToken(authHeader) {
    if (!authHeader) throw new Error('No authentication header')

    if (!authHeader.toLowerCase().startsWith('bearer '))
        throw new Error('Invalid authentication header')

    const split = authHeader.split(' ')
    const token = split[1]

    return token
}
