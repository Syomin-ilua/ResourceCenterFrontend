export function hasSuccessField(mess: unknown): mess is {
    message: string
} {
    return (
        typeof mess === "object" &&
        mess !== null &&
        "message" in mess &&
        typeof mess.message === "string"
    )
}