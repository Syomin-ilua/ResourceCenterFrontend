import { useContext } from "react"
import { ProfsouzContext } from "../pages/profsouz/ProfsouzContext";

export const useProfsouzContext = () => {
    const profsouzData = useContext(ProfsouzContext);
    return profsouzData; 
}