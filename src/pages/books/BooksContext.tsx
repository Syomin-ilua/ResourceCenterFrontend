import { type ChangeEvent, createContext, type ReactNode, type FC, useState, useEffect } from "react";
import { useGetAllBooksQuery, useLazyGetAllBooksQuery } from "../../app/services/booksApi";
import type { Book } from "../../app/types";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import { showMessage } from "../../utils/showMessage";
import { hasErrorField } from "../../utils/hasErrorField";

type TBooksContext = {
    searchValue: string
    booksData: Book[],
    isError: boolean
    isLoading: boolean
    handleSetSearchValue: (event: ChangeEvent<HTMLInputElement>) => void
}

type Props = {
    children: ReactNode
}

export const BooksContext = createContext<TBooksContext>({
    searchValue: "",
    booksData: [],
    isError: false,
    isLoading: false,
    handleSetSearchValue: (event) => { }
});


export const BooksContextProvider: FC<Props> = ({ children }) => {

    const [params, setParams] = useSearchParams();

    const search = params.get("search") || "";

    const [searchValue, setSearchValue] = useState(search);
    const debounceSearchValue = useDebounce(searchValue, 1000);

    const [booksData, setBooksData] = useState<Book[]>([]);

    const { data, isLoading, isError } = useGetAllBooksQuery({ search: debounceSearchValue });
    
    const [triggerGetAllBooks] = useLazyGetAllBooksQuery();

    useEffect(() => {
        if (!isLoading && !isError) {
            setBooksData(data!);
        }
    }, [isLoading, isError, data]);

    useEffect(() => {
        if (debounceSearchValue !== search) {
            setQueryParam('search', debounceSearchValue);
        }

        const getBooks = async () => {
            try {
                await triggerGetAllBooks({ search: debounceSearchValue }).unwrap();
            } catch (error) {
                if (hasErrorField(error)) {
                    showMessage({ message: error.data.error, variantMessage: "error" });
                }
            }
        }

        getBooks();

    }, [debounceSearchValue]);

    useEffect(() => {

        setSearchValue(search);

    }, [search])

    const setQueryParam = (key: string, value: string) => {
        const searchParams = new URLSearchParams(params.toString());
        searchParams.set(key, value);
        setParams(searchParams);
    };


    const handleSetSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    }

    const booksContext: TBooksContext = {
        booksData,
        isError,
        isLoading,
        searchValue,
        handleSetSearchValue,
    }

    return <BooksContext.Provider value={booksContext}>
        {children}
    </BooksContext.Provider>
}