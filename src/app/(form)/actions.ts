"use server"

import { revalidatePath } from "next/cache";
import { validateFormData } from "./validation";
import { S3Client, PutObjectCommand} from "@aws-sdk/client-s3"

interface Message {
    status: string;
    message: string;
}

const accessKeyId = process.env.NEXT_AWS_S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
    throw new Error("Missing AWS credentials");
}

const s3Client = new S3Client({
    region: process.env.NEXT_AWS_S3_REGION,
    credentials: {
        accessKeyId,
        secretAccessKey
    },
});

export async function uploadFile(prevState : any, formData : FormData) : Promise<Message> {
    const validation = await validateFormData(formData);

    if (validation.status === "error") {
        return validation; 
    }

    try {
        const file = formData.get("file") as File;
        const buffer = Buffer.from(await file.arrayBuffer());
        await uploadFileToS3(file.name, buffer);
        revalidatePath("/");

        return { status: "success", message: "File uploaded successfully!" };

    } catch (error) {
        
        return { status: "error", message: "Error uploading file" };
    }
}

async function uploadFileToS3(fileName: string, buffer: Buffer) {
    const fileBuffer = buffer;

    const params = {
        Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
    }
    
    const command = new PutObjectCommand(params);

    try {
        const response = await s3Client.send(command);
        console.log(response);

        return fileName;
    } catch(error){
        console.error(error);
    }
}

