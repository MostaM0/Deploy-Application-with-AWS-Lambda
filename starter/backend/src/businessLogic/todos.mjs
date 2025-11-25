import { v4 as uuidv4 } from 'uuid'
import {
    getTodosForUser as getTodosFromDb,
    createTodo as createTodoInDb,
    updateTodo as updateTodoInDb,
    deleteTodo as deleteTodoInDb,
    updateTodoAttachmentUrl
} from '../dataLayer/todosAccess.mjs'

import {
    getUploadUrl,
    getAttachmentUrl
} from '../fileStorage/attachmentUtils.mjs'

export async function getTodosForUser(userId) {
    return await getTodosFromDb(userId)
}

export async function createTodo(createTodoRequest, userId) {
    const todoId = uuidv4()
    const createdAt = new Date().toISOString()

    const newItem = {
        userId,
        todoId,
        createdAt,
        done: false,
        ...createTodoRequest
    }

    return await createTodoInDb(newItem)
}

export async function updateTodo(todoId, userId, updateTodoRequest) {
    await updateTodoInDb(userId, todoId, updateTodoRequest)
}

export async function deleteTodo(todoId, userId) {
    await deleteTodoInDb(userId, todoId)
}

export async function createAttachmentPresignedUrl(todoId, userId) {
    // 1) Generate signed URL for PUT
    const uploadUrl = getUploadUrl(todoId)

    // 2) Compute the public attachment URL and store it in DynamoDB
    const attachmentUrl = getAttachmentUrl(todoId)
    await updateTodoAttachmentUrl(userId, todoId, attachmentUrl)

    // 3) Return the signed URL to the client
    return uploadUrl
}
