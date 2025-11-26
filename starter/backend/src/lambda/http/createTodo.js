import { createTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../../auth/utils.mjs'
import {createLogger} from "../../utils/logger.mjs";

const logger = createLogger('createTodoHandler')


export const handler = async (event) => {
    logger.info('Processing createTodo event', { event })

    const userId = getUserId(event)
    const newTodo = JSON.parse(event.body)

    if (
        !newTodo.name ||
        typeof newTodo.name !== 'string' ||
        newTodo.name.trim().length < 5
    ) {
        logger.warn('Validation failed for todo name', { userId, body: newTodo })
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
                error: 'Todo name must be at least 5 characters long'
            })
        }
    }

    const item = await createTodo(newTodo, userId)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            item
        })
    }
}

