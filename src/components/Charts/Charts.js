import React, {useEffect, useState} from 'react'
import { Box } from "@material-ui/core"
import { Pie } from 'react-chartjs-2';
import * as api from '../../api/Transaction'
import styles from './Charts.module.css'

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

const topTen = (arr, property) => {
	const top10 =  arr.sort((a,b) => {
		return b[property] - a[property]
	}).slice(0, 10)
	return ({
		top:top10,
		others: arr.slice(10)
	})
}	

const Charts = () => {
	const [Transactions, setTransactions] = useState(null)

	useEffect(() => {
		api.getTransactions().then((res) => {
			setTransactions(res)
		})
	}, [])
	if(!Transactions) return <div>Loading...</div>
	
	const Credit_Amount = {
		labels: topTen(Transactions, "Credit_Amount").top.map((i) => i.Sender),
		datasets: [{
			data: [...topTen(Transactions, "Credit_Amount").top.map((i) => i.Credit_Amount)],
			backgroundColor: Colors,
			hoverBackgroundColor: Colors
		}]
	};
		
	const Debit_Amount = {
		labels: topTen(Transactions, "Debit_Amount").top.map((i) => i.Sender),
		datasets: [{
			data: [...topTen(Transactions, "Debit_Amount").top.map((i) => i.Credit_Amount)],
			backgroundColor: Colors,
			hoverBackgroundColor: Colors
		}]
	};

	console.log(topTen(Transactions, "Credit_Amount"))

    return(
        <Box className={styles.Wrapper}>
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

export default Charts