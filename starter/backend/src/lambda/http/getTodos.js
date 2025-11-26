import { getTodosForUser } from '../../businessLogic/todos.mjs'
import { getUserId } from '../../auth/utils.mjs'
import {createLogger} from "../../utils/logger.mjs";


const logger = createLogger('getTodosHandler')

export const handler = async (event) => {
    logger.info('Processing getTodos event', { event })

    const userId = getUserId(event)
    const todos = await getTodosForUser(userId)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            items: todos
        })
    }
}
