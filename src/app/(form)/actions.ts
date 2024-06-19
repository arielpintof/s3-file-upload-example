"use server"

import { revalidatePath } from "next/cache";
import { validateFormData } from "./validation";
interface Message{
    status: string;
    message: string;

}
export async function uploadFile(prevState : any, formData : FormData) : Promise<Message> {
    const validation = await validateFormData(formData);

    if (validation.status === "error") {
        return validation; 
    }

    try {
        console.log(formData);
        revalidatePath("/");

        return { status: "success", message: "File uploaded successfully!" };

    } catch (error) {
        console.error(error);
        return { status: "error", message: "Error uploading file" };
    }
}

