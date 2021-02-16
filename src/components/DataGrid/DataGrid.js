import React, {useState, useEffect} from 'react'
import {   
    DataGrid,
} from '@material-ui/data-grid';
import {Box} from '@material-ui/core';
import styles from './DataGrid.module.css'
import * as api from '../../api/Transaction'
import { withNamespaces } from 'react-i18next';

const DataGridComponent = ({t}) => { 
  const columns = [
    { field: 'id', 
      headerName: t('Transaction ID'),
      width: 150,
    },
    { field: 'Date', headerName: t('Date'), width: 130, filterable: true },
    { field: 'Debit_Amount', headerName: t('Debit Amount'), width: 140, type: 'number' },
    {
      field: 'Credit_Amount',
      headerName: t('Credit Amount'),
      type: 'number',
      width: 190,
      filterable: true,
    },
    {
      field: 'Sender',
      headerName: t('Sender'),
      sortable: false,
      width: 160,
    },
    {
        field: 'Receiver',
        headerName: t('Receiver'),
        sortable: false,
        width: 160,
    }
  ];
    const [Transactions, setTransactions] = useState(null)

    useEffect(() => {
      api.getTransactions()
      .then((res) => {
        setTransactions(res)
      })
    }, [])
    console.log(t("direction"))
    return(
        <div className={styles.Wrapper} dir={t("direction")}>
            <Box style={{height: "500px"}}>
              {Transactions && Transactions.length > 0 ? 
                  <DataGrid
                    rows={Transactions} 
                    columns={columns} 
                    checkboxSelection
                    localeText={{
                      footerPaginationRowsPerPage: t('Rows per page'),
                    }}
                  />
            : "Loading..."}
            </Box>
        </div>
    )
}

export default withNamespaces()(DataGridComponent)