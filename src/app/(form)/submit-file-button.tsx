"use client"

import { Button } from "@/components/ui/button";
import { useFormStatus} from "react-dom";

export function SubmitButton() {
    const { pending } = useFormStatus();

    if(pending){
        return(
            <Button type="submit" disabled>Subiendo imagen...</Button>
        )
    }
    
    return(
        <Button type="submit">Subir imagen</Button>
    )
}
