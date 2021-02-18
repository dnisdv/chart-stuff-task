import React, {useEffect, useState} from 'react';
import {Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TablePagination, 
  TableRow, 
  TableSortLabel, 
  Toolbar, 
  Paper, 
  IconButton, 
  Tooltip, 
  Typography,
  makeStyles
} from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"
import DateRangeIcon from "@material-ui/icons/DateRange"
import { DateRangePicker } from "materialui-daterange-picker";
import stylescss from "./DataGrid.module.css" 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as api from '../../api/Transaction'
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(transactions, comparator) {
  transactions.sort((a, b) => {
    const order = comparator(a, b);
    if (order !== 0) return order;
  });
  return transactions;
}

const filterByDateRange = (transactions, startDate, endDate) => {
  var resultProductData = transactions.filter(a => {
    var date = new Date(a.Date);
    return (date >= startDate && date <= endDate);
  });
  return resultProductData
}


const headCells = [
  { id: 'id', numeric: false, disablePadding: true, label: 'Transaction id' },
  { id: 'Date', numeric: true, disablePadding: false, label: 'Date' },
  { id: 'Debit_Amount', numeric: true, disablePadding: false, label: 'Debit Amount' },
  { id: 'Credit_Amount', numeric: true, disablePadding: false, label: 'Credit Amount' },
  { id: 'Sender', numeric: false, disablePadding: false, label: 'Sender' },
  { id: 'Receiver', numeric: false, disablePadding: false, label: 'Receiver' },
];

const useToolbarStyles = makeStyles((theme) => ({
  filter : {
    marginLeft: "auto",
    display:"flex",
    justifyContent:"flex-end"
  },
}));

const EnhancedTableToolbar = ({filterbyDate, resetDateRange}) => {
  const classes = useToolbarStyles();
  const [open, setOpen] = useState(false);
  const [dateRange, setDateRange] = useState({});
  
  const changeDateRange = (range) => {
    setDateRange(range)
    filterbyDate(range)
  }

  const toggle = () => setOpen(!open);
  const resetDate = () => {
    setDateRange(null)
    resetDateRange()
  }
  return (
    <div style={{position:"relative"}}>
    <Toolbar
      className={classes.filter}>
        {dateRange && dateRange.startDate && dateRange.endDate ? 
          <Tooltip title="Date Range">
            <div style={{display:"flex", alignItems:"center"}}>
              <IconButton onClick={resetDate} >
                <CloseIcon />  
              </IconButton>
              <Typography>{dateRange.startDate.toLocaleDateString("en-US")} - {dateRange.endDate.toLocaleDateString("en-US")}</Typography>
            </div>
        </Tooltip>
        : ""}

        <Tooltip title="Filter list">
          <IconButton onClick={toggle}  aria-label="filter list">
            <DateRangeIcon />
          </IconButton>
        </Tooltip>
    </Toolbar>


    <div className={stylescss.DateRange}>
      <DateRangePicker
        open={open}
        toggle={toggle}
        onChange={changeDateRange}
      />
    </div>
    </div>
  );
};

const useEnhancedTableHeadStyles = makeStyles((theme) => ({
  Arrow: {
    opacity:"0",
    "&:hover":{
      opacity:1
    }
  }
}));

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const classes = useEnhancedTableHeadStyles()
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            style={{maxWidth:"120px", width:"120px", padding:"0px 0px 0px 16px"}}
            key={headCell.id}
            align='left'
            padding={headCell.disablePadding ? 'none' : 'default'}
          >
            <div className={stylescss.TableHeadTitle}
              onClick={createSortHandler(headCell.id)}
              style={{fontWeight:"bold", color:"#0f0f0f"}}
            >
              {headCell.label} <FontAwesomeIcon className={stylescss.TableHeadIcon} icon={orderBy === headCell.id && order === "asc" ? faArrowUp : faArrowDown} />
            </div>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}




const useStyles = makeStyles((theme) => ({
  root:{
    width:"90%",
    margin:"0 auto;"
  },
  tableCell: {
    maxWidth:"120px",
    width:"80px"
  }
}));

export default function DataGrid() {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [transactions, setTransactions] = useState(null)
  const [DateRange, setDateRange] = useState(null)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleFilterbyDate = ({startDate, endDate}) => {
    setDateRange({startDate, endDate})
    setPage(0)
  }
  const resetDateRange = () => {
    setDateRange(null)
  }
  useEffect(() => {
      api.getTransactions()
      .then((res) => {
        setTransactions(res)
      })

  }, [ DateRange ])
  const FilteredTransactions = transactions && DateRange ? filterByDateRange(transactions, DateRange.startDate, DateRange.endDate) : null
  if(!transactions) return <>...Loading</>

  return (
    <div className={classes.root}>
      <Paper>
        <EnhancedTableToolbar filterbyDate={handleFilterbyDate} resetDateRange={resetDateRange} />
        <TableContainer>
          <Table
            className={classes.table}
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={FilteredTransactions ? FilteredTransactions.length : transactions.length}
            />
            <TableBody>
              {stableSort(FilteredTransactions ? FilteredTransactions : transactions, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      key={row.id}
                    >
                      <TableCell style={{padding:"0px 0px 0px 30px", maxWidth:"20px", width:"20px"}} component="th" scope="row" padding="none">
                        {row.id}
                      </TableCell>
                      <TableCell className={classes.tableCell} align="left">{row.Date}</TableCell>
                      <TableCell className={classes.tableCell} align="left">{row.Debit_Amount}</TableCell>
                      <TableCell className={classes.tableCell} align="left">{row.Credit_Amount}</TableCell>
                      <TableCell className={classes.tableCell} align="left">{row.Sender}</TableCell>
                      <TableCell className={classes.tableCell} align="left">{row.Receiver}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={FilteredTransactions ? FilteredTransactions.length : transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}