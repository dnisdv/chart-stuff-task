import React from 'react'
import styles from './LanguageChanger.module.css'
import { Select, NativeSelect } from "@material-ui/core"

const LanguageChanger = ({changeLanguage}) => {

    const selectChange = (e) => {
        changeLanguage(e.target.value)
    }

    return(
        <div className={styles.Wrapper}>
            <NativeSelect onChange={selectChange} id="select">
                <option value="en">English</option>
                <option value="he">עִבְרִית‎</option>
            </NativeSelect>
        </div>
    )
}

export default LanguageChanger