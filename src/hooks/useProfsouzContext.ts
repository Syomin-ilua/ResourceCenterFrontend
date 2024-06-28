import { useContext } from "react"
import { ProfsouzContext } from "../pages/news/NewsContext";

export const useProfsouzContext = () => {
    const profsouzData = useContext(ProfsouzContext);
    return profsouzData; 
}