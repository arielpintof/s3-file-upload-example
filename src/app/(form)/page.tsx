
import { Input } from "@/components/ui/input"
import { uploadFile } from "@/app/(form)/actions"
import { useFormState } from "react-dom"
import { SubmitButton } from "./submit-file-button";
import { useState } from "react"
import Image from 'next/image'


const initialState = { message: ''};

export function UploadForm() {
    const [state, formAction] = useFormState(uploadFile, initialState);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const imageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setSelectedImage(file);
        console.log(file);
    };

    return(
        <div className="flex flex-col items-center my-3">
            <form action={formAction} className="flex flex-col items-center gap-5 my-2">
                <Input type="file" id="file" name="file" accept="images/*" onChange={imageChange}></Input>
                {selectedImage && (
                    <div className="flex flex-col h-[200px] w-[200px] p-3 relative">
                        <Image
                            className="border-2 rounded-full"
                            src={URL.createObjectURL(selectedImage)}
                            alt="Selected Image"
                            fill
                            style={{objectFit: 'cover'}}
                            />
                    </div>
                )}
                <SubmitButton/>
            </form>
            {state.message && <p>{state.message}</p>}

        </div>
    )
}