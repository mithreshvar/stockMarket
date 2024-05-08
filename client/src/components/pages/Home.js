import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, CirclePlus } from 'lucide-react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { getChange } from "./Market";
import DoughnutChart from "../charts/DoughnutChart";


export default function Home() {

    const [watchlist, setWatchlist] = useState([
        {
            symbol: "AAPL",
            price: 150.25
        },
        {
            symbol: "GOOGL",
            price: 2500.75
        },
        {
            symbol: "MSFT",
            price: 300.50
        },
        {
            symbol: "AMZN",
            price: 3500.00
        },
        {
            symbol: "AMZN",
            price: 3500.00
        }
    ])
    
    const [portfolioData, setPortfolioData] = useState([
        {
            symbol: "TSLA",
            shareAmount: 10,
            price: 700.50,
            change: "+2.5%",
            currentValue: 7005.00
        },
        {
            symbol: "FB",
            shareAmount: 20,
            price: 350.75,
            change: "-1.2%",
            currentValue: 7015.00
        },
        {
            symbol: "NFLX",
            shareAmount: 15,
            price: 550.25,
            change: "+3.8%",
            currentValue: 8253.75
        }
    ])
    return (
        <div className="flex flex-col gap-y-[30px]">
            <div className="bg-white border border-[#ddddddbb] rounded-[20px] flex ">
                
                <div className="w-[180px] py-[10px] flex flex-col gap-y-[5px] ">
                    <div className="flex justify-between items-center px-[15px] ">
                        <h4 className="text-[16px] font-semibold py-[5px]">My Watchlist</h4>
                        <CirclePlus size={18}/>
                    </div>
                    <div className=" max-h-[180px] w-full overflow-auto ">
                        {
                            watchlist.map((stock, index) => (
                                <div key={index} className="flex gap-x-[10px] items-center justify-center p-[10px] border-b first first-of-type:border-t border-[#b9b9b9] h-[45px]">
                                    <span>{stock.symbol}</span>
                                    <span>{stock.price}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className="border bg-[#3f3f3f60] w-[1px] rounded-full" />

                <div>
                    Graphuh  
                </div>    
            </div>

            <div className="bg-white border border-[#ddddddbb] p-[20px] rounded-[20px] flex flex-col gap-y-[10px]">
                <div className="w-full flex justify-between">
                    <h4 className="text-[16px] font-semibold py-[5px]">Profile Overview</h4>
                    <p>View All </p>
                </div>

                <div className="flex gap-x-[15px] w-full">

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 450 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" className='!font-semibold'>Name</TableCell>
                                    <TableCell align="center" className='!font-semibold'>No. of Stocks</TableCell>
                                    <TableCell align="center" className='!font-semibold'>Price</TableCell>
                                    <TableCell align="center" className='!font-semibold'>Change</TableCell>
                                    <TableCell align="center" className='!font-semibold'>Current Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {portfolioData.map((row) => {
                                    
                                    const {change, diff} = getChange(row.price);

                                    return(
                                        <TableRow
                                            key={row.symbol}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row" align="center">
                                                {row.symbol}
                                            </TableCell>
                                            <TableCell align="center">{row.shareAmount}</TableCell>
                                            <TableCell align="center">{row.price}</TableCell>
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
                                            <TableCell align="center">{row.currentValue}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div className=" flex flex-col gap-y-[15px] w-[300px]">
                        <h3 className="text-[18px] font-semibold pl-[10px]">Asset Allocation</h3>
                        <div className="border border-[#3f3f3f60] rounded-[20px] " >
                            <DoughnutChart
                                totalName={"Total Asset"}
                                data = {
                                    [
                                        { name: "Mutual Funds", value: 3, color: "#7140de" },
                                        { name: "Gold", value: 4, color: "#a8ff3d" },
                                        { name: "Stock", value: 2, color: "#CBD9D4" }

                                    ]
                                } 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}