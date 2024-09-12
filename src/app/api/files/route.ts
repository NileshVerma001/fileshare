// src/app/api/files/route.ts
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import File from '@/models/File';
import dbConnect from '@/utils/dbConnect';

// GET: Fetch all files from MongoDB, sorted by creation date (newest first)
export async function GET() {
    await dbConnect(); // MongoDB connection
    try {
        // Fetch files and sort them by `createdAt` in descending order
        const files = await File.find({}).sort({ createdAt: -1 });
        return new Response(JSON.stringify(files), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch files' }), { status: 500 });
    }
}

// DELETE: Delete file from MongoDB and S3
export async function DELETE(req: any) {
    await dbConnect(); // MongoDB connection
    const { fileUrl } = await req.json();
    if (!fileUrl) {
        return new Response(JSON.stringify({ error: 'File URL is required' }), { status: 400 });
    }
    
    const fileKey = fileUrl.split('/').pop();
    const s3Client = new S3Client({
        region: 'eu-north-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY || '',
            secretAccessKey: process.env.AWS_SECRET_KEY || '',
        },
        endpoint: 'https://s3.eu-north-1.amazonaws.com'
    });

    try {
        // Delete the file from S3
        await s3Client.send(new DeleteObjectCommand({
            Bucket: 'nilesh-campuscrave',
            Key: fileKey
        }));

        // Delete the file record from MongoDB
        await File.deleteOne({ fileUrl });
        return new Response(JSON.stringify({ success: 'File deleted' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to delete file' }), { status: 500 });
    }
}
