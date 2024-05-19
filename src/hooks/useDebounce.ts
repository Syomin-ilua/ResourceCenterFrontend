import { useEffect, useState } from "react";

export const useDebounce = (searchValue: string, delay: number) => {

    const [debounceValue, setDebounceValue] = useState(searchValue);

    useEffect(() => {

        const handler = setTimeout(() => {
            setDebounceValue(searchValue);
        }, delay);

        return () => {
            clearTimeout(handler);
        }
    }, [searchValue]);

    return debounceValue;

}