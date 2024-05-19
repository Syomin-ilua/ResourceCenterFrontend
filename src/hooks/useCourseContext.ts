import { useContext } from "react"
import { CourseContext } from "../pages/course/CourseContext"

export const useCourseContext = () => {
    const courseData = useContext(CourseContext);
    return courseData; 
}