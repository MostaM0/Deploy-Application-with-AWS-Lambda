// src/lambda/http/deleteTodo.js
import { deleteTodo } from '../../businessLogic/todos.mjs'
import { getUserId } from '../../auth/utils.mjs'

export const handler = async (event) => {
    console.log('Processing deleteTodo event', event)

    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId

    await deleteTodo(todoId, userId)

    return {
        statusCode: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: ''
    }
}
