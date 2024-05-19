import { useContext } from "react"
import { BooksContext } from "../pages/books/BooksContext"; 

export const useBooksContext = () => {
    const booksData = useContext(BooksContext);
    return booksData; 
}