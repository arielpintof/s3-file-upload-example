"use server"

export async function validateFormData(formData: FormData) {
    const entries = Array.from(formData.entries());

    for (const [key, value] of entries) {
        if (value instanceof File) {
            if (!isValidImageFile(value)) {
                return { status: "error", message: "Invalid file type" };
            }
        }
    }

    return { status: "success", message: "Sucessfull upload" };
}


function isValidImageFile(file: File) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg','application/pdf'];
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.pdf)$/i;

    if (!allowedMimeTypes.includes(file.type)) {
        return false;
    }

    if (!allowedExtensions.test(file.name)) {
        return false;
    }

    return true;
}