import { enqueueSnackbar } from "notistack";

type Message = {
    message: string,
    variantMessage?: "success" | "info" | "error" | "warning" | "default"
}

export const showMessage = ({ message, variantMessage = "default" }: Message) => {
    enqueueSnackbar(message, { variant: variantMessage, transitionDuration: 400 });
} 
