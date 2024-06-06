import { useEffect } from "react";
import { Books } from "../../components/books";
import { Loader } from "../../components/loader";
import { SVG } from "../../components/svg";
import { useBooksContext } from "../../hooks/useBooksContext";
import styles from "./index.module.css";
import Select from "react-select";
import { MemberInLibrary } from "../../components/memberInLibrary";

export const BooksPage = () => {

    const { isLoading, isError, handleSetSearchValue, booksData, searchValue, getValue, onChangeSelect, options } = useBooksContext();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    return (
        <div className={styles.books}>
            <div className="container">
                <div className={styles.top}>
                    <div className={styles.search__wrapper}>
                        <div className={styles.search}>
                            <input disabled={isError} name="search" className={styles.search__input} type="text" placeholder="Введите название книги" value={searchValue} onChange={handleSetSearchValue} />
                            <SVG id="search-icon" />
                        </div>
                        <div className={styles.categoryBook}>
                            <Select
                                isSearchable={false}
                                className={styles.select}
                                onChange={onChangeSelect}
                                value={getValue()}
                                options={options}
                            />
                        </div>
                    </div>
                    <MemberInLibrary />
                </div>
                {isLoading && !isError && <div className={styles.loader__wrapper}><Loader /></div>}
                {!isLoading && isError && <div className="container">Произошла ошибка</div>}
                {!isLoading && !isError && !booksData.length &&
                    <div className={styles.empty}>
                        <SVG id="empty-icon" />
                        К сожалению тут пока ничего нет
                    </div>
                }
                {!isLoading && !isError && booksData.length !== 0 &&
                    <Books booksData={booksData} />
                }
            </div>
        </div>
    )
}