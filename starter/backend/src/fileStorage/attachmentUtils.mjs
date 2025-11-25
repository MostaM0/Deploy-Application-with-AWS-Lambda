import AWS from 'aws-sdk'
import AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

const bucketName = process.env.ATTACHMENTS_S3_BUCKET
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION || '300', 10)

export function getUploadUrl(todoId) {
    console.log('Generating upload URL for', todoId)

    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: todoId,
        Expires: urlExpiration
    })
}

export function getAttachmentUrl(todoId) {
    return `https://${bucketName}.s3.amazonaws.com/${todoId}`
}
