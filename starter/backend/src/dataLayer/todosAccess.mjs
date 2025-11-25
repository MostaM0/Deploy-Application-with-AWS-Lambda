import AWS from 'aws-sdk'
import AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)
const docClient = new XAWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE
const todosCreatedAtIndex = process.env.TODOS_CREATED_AT_INDEX

export async function getTodosForUser(userId) {
    console.log('Getting all todos for user', userId)

    const result = await docClient.query({
        TableName: todosTable,
        IndexName: todosCreatedAtIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        },
        ScanIndexForward: false
    }).promise()

    return result.Items
}

export async function createTodo(todoItem) {
    console.log('Creating a new todo', todoItem)

    await docClient.put({
        TableName: todosTable,
        Item: todoItem
    }).promise()

    return todoItem
}

export async function updateTodo(userId, todoId, updatedFields) {
    console.log('Updating todo', { userId, todoId, updatedFields })

    const { name, dueDate, done } = updatedFields

    await docClient.update({
        TableName: todosTable,
        Key: { userId, todoId },
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeNames: {
            '#name': 'name'
        },
        ExpressionAttributeValues: {
            ':name': name,
            ':dueDate': dueDate,
            ':done': done
        },
        ReturnValues: 'NONE'
    }).promise()
}

export async function deleteTodo(userId, todoId) {
    console.log('Deleting todo', { userId, todoId })

    await docClient.delete({
        TableName: todosTable,
        Key: { userId, todoId }
    }).promise()
}

export async function updateTodoAttachmentUrl(userId, todoId, attachmentUrl) {
    console.log('Updating attachment URL', { userId, todoId, attachmentUrl })

    await docClient.update({
        TableName: todosTable,
        Key: { userId, todoId },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
            ':attachmentUrl': attachmentUrl
        },
        ReturnValues: 'NONE'
    }).promise()
}
