import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { uploadFile } from "@/app/(form)/actions"
import { useFormState } from "react-dom"
import { SubmitButton } from "./submit-file-button";


const initialState = { message: ''};

export function UploadForm() {
    const [state, formAction] = useFormState(uploadFile, initialState);
    return(
        <div className="my-3">
            <form action={formAction} className="flex flex-col gap-5 my-2">
                <Input type="file" id="file" name="file" accept="images/*"></Input>
                <SubmitButton/>
            </form>
            {state.message && <p>{state.message}</p>}
        </div>
    )
}