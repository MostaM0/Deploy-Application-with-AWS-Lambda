// src/lambda/http/generateUploadUrl.js
import { createAttachmentPresignedUrl } from '../../businessLogic/todos.mjs'
import { getUserId } from '../../auth/utils.mjs'

export const handler = async (event) => {
    console.log('Processing generateUploadUrl event', event)

    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId

    const uploadUrl = await createAttachmentPresignedUrl(todoId, userId)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            uploadUrl
        })
    }
}
