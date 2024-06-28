import { type FC, createContext, type ReactNode, useState, useEffect } from "react"
import type { News } from "../../app/types"
import { useGetAllNewsQuery, useLazyGetAllNewsQuery } from "../../app/services/newsApi"
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import type { SerializedError } from "@reduxjs/toolkit"
import { hasErrorField } from "../../utils/hasErrorField"
import { showMessage } from "../../utils/showMessage"

type Options = {
    value: string
    label: string
}

type Props = {
    children: ReactNode
}

const options: Options[] = [
    { value: 'all', label: 'Всё' },
    { value: 'Профсоюз', label: 'Профсоюз' },
    { value: 'Производство', label: 'Производство' }
];

type ProfsouzContext = {
    getValue: () => Options | undefined
    onChangeSelect: (newValue: any) => void
    options: Options[]
    categoryNews: string
    news: News[]
    isLoading: boolean
    isError: boolean
    error: FetchBaseQueryError | SerializedError | undefined
}


export const ProfsouzContext = createContext<ProfsouzContext>({
    getValue: () => undefined,
    onChangeSelect: (newValue) => { },
    categoryNews: "all",
    news: [],
    options,
    isLoading: false,
    isError: false,
    error: undefined
});

export const ProfsouzContextProvider: FC<Props> = ({ children }) => {

    const [news, setNews] = useState<News[]>([]);
    const [categoryNews, setCategoryNews] = useState("all");

    const { data, isLoading, isError, error } = useGetAllNewsQuery({});
    const [triggerGetAllNews] = useLazyGetAllNewsQuery();

    useEffect(() => {
        if (!isLoading && !isError && data) {
            setNews(data);
        }
    }, [isLoading, isError, data]);

    useEffect(() => {
        const getAllNews = async () => {
            try {
                const news = await triggerGetAllNews({ newsCategory: categoryNews }).unwrap();
                setNews(news);
            } catch (error) {
                if (hasErrorField(error)) {
                    showMessage({ message: error.data.error, variantMessage: "error" });
                }
            }
        }

        getAllNews();
    }, [categoryNews]);

    const onChangeSelect = (newValue: any) => {
        setCategoryNews(newValue.value);
    }

    const getValue = () => {
        return categoryNews ? options.find(c => c.value === categoryNews) : undefined
    }

    const profsouzContext = {
        getValue,
        onChangeSelect,
        options,
        categoryNews,
        isLoading,
        isError,
        news,
        error
    }

    return <ProfsouzContext.Provider value={profsouzContext}>{children}</ProfsouzContext.Provider>
}