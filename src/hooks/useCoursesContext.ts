import { useContext } from "react"
import { CoursesContext } from "../pages/courses/CoursesContext"; 

export const useCoursesContext = () => {
    const coursesData = useContext(CoursesContext);
    return coursesData; 
}