import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, CirclePlus } from 'lucide-react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { getChange } from "./Market";
import DoughnutChart from "../charts/DoughnutChart";
import { useSelector } from "react-redux";
import LineChart from "../charts/LineChart";
import { Link, useNavigate } from "react-router-dom";


export default function Home() {

    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

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
    
    const [portfolioData, setPortfolioData] = useState([])

    useEffect(() => {
        (async function() {
            let slicedPortfolio = user.portfolio.slice(0, 5);
            console.log(slicedPortfolio)
            let portfolioData = [];
            for (let i = 0; i < slicedPortfolio.length; i++) {
                const item = slicedPortfolio[i];
                const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/api/stock/id/" + item.stock);
                const data = await response.json();
                // console.log(data)
                const stock = data.stock;
                const currentValue = stock.price[stock.price.length-1] * item.quantity;
                portfolioData.push({
                    symbol: stock.symbol,
                    shareAmount: item.quantity,
                    priceBought: item.price,
                    price: stock.price,
                    currentValue
                })
            }
            setPortfolioData(portfolioData);
        })()
    }, [user])
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

                <div className="w-[calc(100%-260px)]">
                    <LineChart data={[100,255,321,234,362,221,124,321,452,122,421,25]} interval={5} />  
                </div>    
            </div>

            <div className="bg-white border border-[#ddddddbb] p-[20px] rounded-[20px] flex flex-col gap-y-[10px]">
                <div className="w-full flex justify-between">
                    <h4 className="text-[16px] font-semibold py-[5px]">Profile Overview</h4>
                    <p>View All </p>
                </div>

                <div className="flex gap-x-[15px] w-full">

                {
                    portfolioData.length === 0 ?
                        <div className="flex flex-col gap-y-[15px] items-center justify-center w-full h-[200px] text-[18px] ">
                            <p className="text-[20px] font-semibold text-[#3f3f3f60]">No data available</p>
                            <p className="text-[16px]">Please proceed to <Link to={'/market'} className="bg-[#4f4ffcfc] hover:bg-[#3030d1d2] px-[10px] p-[4px] rounded-md text-white font-medium cursor-pointer">Market</Link> to buy some stocks.</p>
                        </div>
                    :
                    <>
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
                                                className='hover:bg-[#3b3bbc18] cursor-pointer transition-all duration-200 ease-in-out'
                                                key={row.symbol}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                onClick={() => {navigate(`/stock/${row.symbol}`)}}
                                            >
                                                <TableCell component="th" scope="row" align="center">
                                                    {row.symbol}
                                                </TableCell>
                                                <TableCell align="center">{row.shareAmount}</TableCell>
                                                <TableCell align="center">{row.priceBought}</TableCell>
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
                                            { 
                                                name: "Mutual Funds", 
                                                value: user.portfolio.reduce( (acc, item) => { 
                                                    acc = item.type === 'Mutual Funds' ? acc + 1 : acc;
                                                    return acc;
                                                }, 0),
                                                color: "#7140de" 
                                            },
                                            { 
                                                name: "Gold", 
                                                value: user.portfolio.reduce( (acc, item) => { 
                                                    acc = item.type === 'Gold' ? acc + 1 : acc;
                                                    return acc;
                                                }, 0),
                                                color: "#a8ff3d" 
                                            },
                                            { 
                                                name: "Stock", 
                                                value: user.portfolio.reduce( (acc, item) => { 
                                                    acc = item.type === 'Stock' ? acc + 1 : acc;
                                                    return acc;
                                                }, 0),
                                                color: "#CBD9D4" 
                                            },
                                        ]
                                    } 
                                />
                            </div>
                        </div>
                    </>
                }
                
                </div>
            </div>
        </div>
    );
}