import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getChange } from './Market';
import { bouncy } from 'ldrs';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../../slices/authSlice';
import { toast } from 'sonner';
import LineChart from '../charts/LineChart';


bouncy.register()

function IndividualStock() {

  const {symbol} = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);


  const [currentStock, setCurrentStock] = useState(null);
  const [currentActive, setCurrentActive] = useState("Buy");

  const [quantity, setQuantity] = useState('')

  const handleEvent = (e) => {
    if (e.target.value.match(/[^0-9]/g)) return;
    if(e.target.id === 'quantity') setQuantity(e.target.value);
  }

  const handleBuy = async () => {
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/api/stock/buy", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.token
      },
      body: JSON.stringify({
        stockid: currentStock._id,
        quantity,
      })
    });
    const data = await response.json();

    if (data.error) {
      toast.error(data.error);
      console.log(data.error)
      return;
    }

    setQuantity('');
    const updatedUser = {...user};
    updatedUser.balance = data.user.balance;
    updatedUser.portfolio = data.user.portfolio; 
    toast.success('Stock bought successfully');

    dispatch(setAuth(updatedUser));
    setCurrentStock(data.stock);

  }

  const handleSell = async () => {

    const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/api/stock/sell", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + user.token
      },
      body: JSON.stringify({
        stockid: currentStock._id,
        quantity,
      })
    })
    
    const data = await response.json();

    if (data.error) {
      toast.error(data.error);
      console.log(data.error)
      return;
    }

    setQuantity('');
    const updatedUser = {...user};
    updatedUser.balance = data.user.balance;
    updatedUser.portfolio = data.user.portfolio;
    toast.success('Stock sold successfully');

    dispatch(setAuth(updatedUser));
    setCurrentStock(data.stock);

  }

  useEffect(() => {

    (async () => {
      const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/api/stock/" + symbol);
      const data = await response.json();
      setCurrentStock(data.stock);
    })();

  } , [symbol])

  return (
    <div className='w-full h-full flex gap-x-[30px]'>

      {
        (currentStock) ?

        <>
        <div className='w-full h-full flex flex-col bg-white border border-[#ddddddbb] rounded-[20px] p-[30px] gap-y-[15px]'>

          <div className='flex flex-col gap-y-[10px]'>
            <h5 className='text-[16px] font-medium'>{symbol}</h5>
            <h1 className='text-[25px] font-semibold'>{currentStock.name}</h1>
          </div>

          {
            (function () {

              const {diff, change} = getChange(currentStock.price);
              return (
                <div className='flex justify-between items-end'>
                  <div className='flex gap-x-[5px] items-end text-[15px] font-semibold '>
                    <span className='text-[34px] '>₹ {currentStock.price[currentStock.price.length-1]}</span>
                    <span className={` ml-[10px] pb-[7px] ${diff > 0 ? ' text-[#008854] ' : ' text-[#C8102E] ' } `}>{diff}</span>
                    <span className={` pb-[7px] ${diff > 0 ? ' text-[#008854] ' : ' text-[#C8102E] ' } `}>({change}%)</span>
                    <span className='pb-[7px] font-normal'>1D</span>
                  </div>
                
                  <p className='pb-[7px]'> <span className='font-bold'>{currentStock.shareAmount}</span> shares available</p>
                </div>
              )
            })()
          }

          <div className='h-full flex justify-center items-center'>
            <LineChart data={currentStock.price} interval={3} />
          </div>
        </div>

        <div className='w-[40%] h-full bg-white border border-[#ddddddbb] rounded-[20px] p-[30px] flex flex-col gap-y-[20px]'>
            
            <div className='flex gap-x-[40px] text-[20px]'>
              <div className={` cursor-pointer select-none  ${currentActive === 'Buy' && ' font-semibold '} `} onClick={() => setCurrentActive('Buy')}>Buy</div>
              <div className={` cursor-pointer select-none  ${currentActive === 'Sell' && ' font-semibold  '} `} onClick={() => setCurrentActive('Sell')}>Sell</div>
            </div>

            <div className='w-full border border-[#dddddd] mb-[40px] ' />

            <div className='flex flex-col gap-y-[150px]'>
              <div className=' gap-y-[30px] grid grid-cols-3'>
                <label className='text-[18px]'>Quantity</label>
                <input id="quantity" className='w-full border border-[#dddddd] rounded-[5px] p-[5px] col-span-2' value={quantity} onChange={handleEvent} />
                <label className='text-[18px]'>Price</label>
                <p>₹ { Number(quantity) * currentStock.price[currentStock.price.length-1]}</p>
              </div>
              {
                (currentActive === 'Buy') ?
                  <button className='w-full bg-[#008854] text-white rounded-[5px] p-[5px]' onClick={handleBuy}>Buy</button>
                :
                  <button className='w-full bg-[#FF5349] text-white rounded-[5px] p-[5px]' onClick={handleSell}>Sell</button>
              }
            </div>

        </div>
        </>

        :

        <div className="flex justify-center items-center w-full ">
            <l-bouncy
                size="45"
                speed="1.75" 
                color="black" 
            ></l-bouncy>
        </div>
      }

    </div>
  )
}

export default IndividualStock;