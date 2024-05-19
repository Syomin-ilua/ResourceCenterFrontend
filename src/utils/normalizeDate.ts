export function normalizeDate (date?: Date) {
    if(!date) {
        return ""
    }

    return new Date(date).toLocaleDateString();
}