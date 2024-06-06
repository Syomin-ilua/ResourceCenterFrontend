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
    onChangeSelect: (newValue: any) => void
    options: Options[]
    categoryBook: string
    getValue: () => Options | undefined
    handleSetSearchValue: (event: ChangeEvent<HTMLInputElement>) => void
}

type Props = {
    children: ReactNode
}

const options: Options[] = [
    { value: "all", label: "Все" },
    { value: "technical", label: "Технические" },
    { value: "artistic", label: "Художественные" },
    { value: "magazines", label: "Журналы" }
];

export const BooksContext = createContext<TBooksContext>({
    searchValue: "",
    booksData: [],
    isError: false,
    isLoading: false,
    options: options,
    categoryBook: "all",
    getValue: () => undefined,
    onChangeSelect: (newValue) => { },
    handleSetSearchValue: (event) => { }
});

type Options = {
    value: string
    label: string
}


export const BooksContextProvider: FC<Props> = ({ children }) => {

    const [params, setParams] = useSearchParams();

    const search = params.get("search") || "";
    const categoryBookParam = params.get("categoryBook") || "all";

    const [categoryBook, setCategoryBook] = useState(categoryBookParam);

    const [searchValue, setSearchValue] = useState(search);
    const debounceSearchValue = useDebounce(searchValue, 1000);

    const [booksData, setBooksData] = useState<Book[]>([]);

    const { data, isLoading, isError } = useGetAllBooksQuery({ search: debounceSearchValue, categoryBook });

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

        if (categoryBook !== categoryBookParam) {
            setQueryParam('categoryBook', categoryBook);
        }

        const getBooks = async () => {
            try {
                await triggerGetAllBooks({ search: debounceSearchValue, categoryBook }).unwrap();
            } catch (error) {
                if (hasErrorField(error)) {
                    showMessage({ message: error.data.error, variantMessage: "error" });
                }
            }
        }

        getBooks();

    }, [debounceSearchValue, categoryBook]);

    useEffect(() => {
        setSearchValue(search);
    }, [search])

    useEffect(() => {
        setCategoryBook(categoryBookParam);
    }, [categoryBookParam]);

    const setQueryParam = (key: string, value: string) => {
        const searchParams = new URLSearchParams(params.toString());
        searchParams.set(key, value);
        setParams(searchParams);
    };


    const handleSetSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    }

    const onChangeSelect = (newValue: any) => {
        setCategoryBook(newValue.value);
    }

    const getValue = () => {
        return categoryBook ? options.find(c => c.value === categoryBook) : undefined
    }

    const booksContext: TBooksContext = {
        booksData,
        isError,
        isLoading,
        searchValue,
        options,
        categoryBook,
        getValue,
        onChangeSelect,
        handleSetSearchValue,
    }

    return <BooksContext.Provider value={booksContext}>
        {children}
    </BooksContext.Provider>
}