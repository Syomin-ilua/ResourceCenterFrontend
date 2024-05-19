import { type FC } from "react"
import styles from "./index.module.css";

type Props = {
    urlDocument: string
}

export const PDFViewer: FC<Props> = ({ urlDocument }) => {


    return (
        <div className={styles.PDFViewer}>
            <iframe
            height={`1000px`}
            width={`100%`} 
            src={urlDocument}>
            </iframe>
        </div>
    )
}