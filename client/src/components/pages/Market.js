import React, { useEffect, useState } from 'react'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { bouncy } from 'ldrs'
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

bouncy.register()

export function getChange( price ) {
    let change = 0
    let diff = 0
    if(price.length > 1){
        diff = price[price.length-1] - price[price.length-2];
        change = diff / price[price.length-2] * 100;
        change = Math.round(change * 100) / 100;
        diff = Math.round(diff * 100) / 100;
    }

    return {change, diff};
}

function Market() {
    const navigate = useNavigate()

    useEffect(() => {

        (async () => {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL+"/api/stock");
            const data = await response.json();
            setAllStocks(data.stocks);
        })()

    }, [])

    const [allStocks, setAllStocks] = useState([])
    
  return (
    <div className="bg-white border border-[#ddddddbb] rounded-[20px] flex flex-col gap-y-[15px] p-[30px]">
        <h1 className='text-[18px] font-semibold'>Market Shares</h1>

        {
            allStocks.length === 0 ? 

            <div className="flex justify-center items-center w-full min-h-[300px]">
                <l-bouncy
                    size="45"
                    speed="1.75" 
                    color="black" 
                ></l-bouncy>
            </div>
            :

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 450 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" className='!font-semibold'>Name</TableCell>
                            <TableCell align="center" className='!font-semibold'>No. of Stocks</TableCell>
                            <TableCell align="center" className='!font-semibold'>Current Price</TableCell>
                            <TableCell align="center" className='!font-semibold'>Change</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allStocks.map((row) => {

                            const {change, diff} = getChange(row.price)
                            
                            return(
                                <TableRow
                                    className='hover:bg-[#3b3bbc18] cursor-pointer transition-all duration-200 ease-in-out'
                                    key={row.symbol}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    onClick={() => {navigate(`/stock/${row.symbol}`)}}
                                >
                                    <TableCell component="th" scope="row" align="center">
                                        {row.symbol}
                                    </TableCell>
                                    <TableCell align="center">{row.shareAmount}</TableCell>
                                    <TableCell align="center">{row.price[row.price.length-1]}</TableCell>
                                    <TableCell align="center">
                                        <div className='flex items-center justify-center gap-x-[10px]'> 
                                            {diff}
                                            <div className={`  border rounded-[15px] flex gap-x-[5px] items-center justify-center px-[5px] ${ diff > 0 ? ' bg-[#00885420] border-[#008854] text-[#008854] ' : ' bg-[#C8102E20] border-[#C8102E] text-[#C8102E] ' } `}>
                                                {(diff > 0)? <ArrowUp size={16} strokeWidth={'2.5px'}/> : <ArrowDown size={16} strokeWidth={'2.5px'}/> }
                                                {change}
                                                % 
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        }

        
    </div>
  )
}

export default Market