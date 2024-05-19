import { type FC, type ReactNode, createContext, useState, useEffect, type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetCoursesQuery, useLazyGetCoursesQuery } from "../../app/services/coursesApi";
import { useDebounce } from "../../hooks/useDebounce";
import { hasErrorField } from "../../utils/hasErrorField";
import { showMessage } from "../../utils/showMessage";
import type { Course } from "../../app/types";
// type Course = {
//     id: string;
//     courseName: string;
//     courseImage: string;
//     theoreticalMaterials: string;
// }

type TCoursesContext = {
    searchValue: string
    coursesData: Omit<Course, "questions">[]
    isError: boolean
    isLoading: boolean
    handleSetSearchValue: (event: ChangeEvent<HTMLInputElement>) => void
}

export const CoursesContext = createContext<TCoursesContext>({
    coursesData: [],
    searchValue: "",
    isError: false,
    isLoading: false,
    handleSetSearchValue: (event) => { },
});

type Props = {
    children: ReactNode
}

export const CoursesContextProvider: FC<Props> = ({ children }) => {

    const [params, setParams] = useSearchParams();

    const search = params.get("search") || "";

    const [searchValue, setSearchValue] = useState(search);
    const debounceSearchValue = useDebounce(searchValue, 1000);

    const [coursesData, setCoursesData] = useState<Omit<Course, "questions">[]>([]);

    const { data, isLoading, isError } = useGetCoursesQuery({ search: debounceSearchValue });
    const [triggerGetCourses] = useLazyGetCoursesQuery();

    useEffect(() => {
        if (!isLoading && !isError) {
            setCoursesData(data!);
        }
    }, [isLoading, isError, data]);

    useEffect(() => {
        if (debounceSearchValue !== search) {
            setQueryParam('search', debounceSearchValue);
        }

        const getCourses = async () => {
            try {
                await triggerGetCourses({ search: debounceSearchValue }).unwrap();
            } catch (error) {
                if (hasErrorField(error)) {
                    showMessage({ message: error.data.error, variantMessage: "error" });
                }
            }
        }

        getCourses();

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

    const coursesContext: TCoursesContext = {
        coursesData,
        isError,
        isLoading,
        searchValue,
        handleSetSearchValue,
    }

    return <CoursesContext.Provider value={coursesContext}>
        {children}
    </CoursesContext.Provider>
}