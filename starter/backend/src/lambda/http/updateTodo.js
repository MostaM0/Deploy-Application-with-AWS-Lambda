// src/lambda/http/updateTodo.js
import { updateTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../../auth/utils.mjs'
import {createLogger} from "../../utils/logger.mjs";


const logger = createLogger('updateTodoHandler')

export const handler = async (event) => {
    logger.info('Processing updateTodo event', { event })

    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    const updatedTodo = JSON.parse(event.body)

    await updateTodo(todoId, userId, updatedTodo)

    return {
        statusCode: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: ''
    }
}
