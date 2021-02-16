import React, {useEffect, useState} from 'react'
import { Box } from "@material-ui/core"
import { Pie } from 'react-chartjs-2';
import * as api from '../../api/Transaction'
import styles from './Charts.module.css'
import { withNamespaces } from 'react-i18next';

const Colors = [
	'#FF6384',
	'#36A2EB',
	'#FFCE56',
	'#f5d442',
	"#f55442",
	'#FF6384',
	'#36A2EB',
	'#FFCE56',
	'#f5d442',
	"#f55442"
]

const Charts = ({t}) => {
	const [Transactions, setTransactions] = useState(null)

	useEffect(() => {
		api.getTransactions().then((res) => {
			setTransactions(res)
		})
	}, [])
	if(!Transactions) return <div>Loading...</div>

	const Credit_Amount_Values  = Transactions.reduce((a, i) =>{ 
		// For not to make over 900 pieces on chart
		const number = Math.round(i.Credit_Amount / 100000) * 100000
		if(a.includes(number)){
			return a
		}else{
			return [...a, number]
		}
	} , [])
	const Credit_Amount = {
		labels: Credit_Amount_Values,
		datasets: [{
			data: Credit_Amount_Values,
			backgroundColor: Colors,
			hoverBackgroundColor: Colors
		}]
	};


	const Debit_Amount_Values  = Transactions.reduce((a, i) =>{ 
		// For not to make over 900 pieces on chart
		const number = Math.round(i.Debit_Amount / 1000) * 1000
		if(a.includes(number)){
			return a
		}else{
			return [...a, number]
		}
	} , [])
	const Debit_Amount = {
		labels: Debit_Amount_Values,
		datasets: [{
			data: Debit_Amount_Values,
			backgroundColor: Colors,
				hoverBackgroundColor: Colors
		}]
	};

    return(
        <Box className={styles.Wrapper} dir={t("direction")} >
			<div style={{width:"500px"}}>
				<Pie
					options={{ maintainAspectRatio: false }}
					data={Debit_Amount} />
			</div>
			<div style={{width:"500px"}}>
				<Pie  
					options={{ maintainAspectRatio: false }}
					data={Credit_Amount} />
			</div>
        </Box>
    )
}

export default withNamespaces()(Charts)