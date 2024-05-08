import React, { useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import StoreIcon from '../Icons/StoreIcon'
import { BiHomeHeart } from "react-icons/bi";
import Dialog from '@mui/material/Dialog';
import { CircleFadingPlusIcon, HandCoinsIcon, InfoIcon, TrendingUpIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from '../slices/authSlice';
import { toast, Toaster } from 'sonner'

function RootLayout() {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [openChangeWallet, setOpenChangeWallet] = useState(false);

    const [wallet, setWallet] = useState('');

    const closeChangeWallet = () => {
        setOpenChangeWallet(false);
        setWallet('');
    }

    const handleWallet = (e) => {
        if (e.target.value.match(/^[0-9]*$/) || e.target.value === '')
        setWallet(e.target.value);
    }

    const saveWalletChange = async () => {
        if (wallet === '') {
            toast.error('Please enter a valid amount');
            return;
        }

        const response = await fetch( process.env.REACT_APP_BACKEND_URL+'/api/user/wallet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ wallet })
        });

        const data = await response.json();
        if (!data.error) {
            toast.success('Wallet balance updated successfully');
            dispatch(setAuth({ ...user, balance: Number(wallet) }));
            closeChangeWallet();
        } else {
            console.log(data)
            toast.error('An error occurred. Please try again later');
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('user');
        dispatch(setAuth(null));
    }

    return (
        <div className='h-screen w-screen overflow-x-auto flex p-[20px] bg-[#fbffd4] gap-x-[30px]'>
            
            <nav className='w-[280px] h-full px-[10px] flex flex-col justify-between text-[18px] rounded-[20px] py-[30px] gap-y-[10px] bg-white border border-[#ddddddbb] '>
                <div className=' flex flex-col gap-y-[15px] items-center ' >
                    <div className='flex gap-x-[15px] items-center text-[22px]'>
                        <StoreIcon className="h-8 w-8" />
                        <span className='font-medium'>Stockify</span>
                    </div>
                    
                    <div className='border border-[#dddddd80] w-full rounded-full' />

                    <div className='flex flex-col gap-y-[10px] items-center'>
                        <img src={'https://i.pinimg.com/236x/6b/c9/da/6bc9daa53be05654c3c2d8601d34d85a.jpg'} alt="profile" className='h-[150px] w-[150px] rounded-full' />
                        <div className='flex flex-col'>
                            <h3 className='text-[18px] font-semibold'>{user.name}</h3>
                            <p className='text-[14px] text-[#666666]'>{user.email}</p>
                        </div>
                    </div>

                    <div className=' w-full bg-[#7140de] flex flex-col p-[10px] px-[15px] pt-[20px] rounded-[15px] mx-[20px] text-white relative overflow-clip'>
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className='absolute top-[-150px] right-[-150px] translate-x-[25px] translate-y-[10px] rotate-[-100deg] z-[0]'>
                            <path fill="#a8ff3d" d="M33.6,-51.5C40.1,-54.5,39.5,-38.5,36.7,-26.7C33.9,-15,28.9,-7.5,31.3,1.4C33.8,10.3,43.7,20.6,42.9,26.2C42.1,31.8,30.7,32.6,21.8,33.8C12.9,35,6.4,36.5,-3.6,42.8C-13.7,49.1,-27.4,60.2,-40.7,61.5C-53.9,62.8,-66.6,54.3,-63.5,42.4C-60.3,30.5,-41.3,15.3,-37.8,2C-34.4,-11.3,-46.5,-22.5,-46.4,-28.8C-46.3,-35.1,-34,-36.3,-24.2,-31.4C-14.5,-26.5,-7.2,-15.4,3.2,-20.9C13.6,-26.4,27.1,-48.5,33.6,-51.5Z" transform="translate(100 100)" />
                        </svg>

                        <CircleFadingPlusIcon className='self-end mt-[-5px] mr-[-5px] text-[#000000] z-[1] cursor-pointer' onClick={() => setOpenChangeWallet(true)} />
                        <div className='z-[1]' >
                            <h5 className='text-[13px]'>Portfolio balance</h5>
                            <h3 className='text-[22px] ml-[15px] font-semibold'>₹ {user.balance}</h3>
                        </div>
                    </div>

                    <div className=' w-full flex flex-col gap-y-[15px] p-[10px] text-[17px]'>
                        <Link to='/' className='flex items-center gap-x-[10px]'>
                            <BiHomeHeart className='text-[24px]'/>Home
                        </Link>
                        <div className='flex items-center gap-x-[10px] cursor-pointer' onClick={ () => setOpenChangeWallet(true)}>
                            <HandCoinsIcon className='text-[24px]'/>Change Wallet
                        </div>
                        <Link to='/market' className='flex items-center gap-x-[10px]'>
                            <TrendingUpIcon className='text-[24px]'/>Market
                        </Link>
                        <Link to='/about' className='flex items-center gap-x-[10px]'>
                            <InfoIcon className='text-[24px]'/>About
                        </Link>
                    </div>
                </div>

                <div className='px-[10px] py-[4px] text-center mx-[20px] bg-red-500 text-white font-semibold rounded-md cursor-pointer' onClick={handleLogout} >Log Out</div>
            </nav>
            <div className='h-full w-full'>
                <Outlet />
            </div>

            <Dialog
                open={openChangeWallet}
                onClose={() => closeChangeWallet()}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{ '& .MuiDialog-paper': { borderRadius: '15px' }, '& .MuiDialog-paperWidthSm': { minWidth: '600px'}}}
            >
                <div className='bg-white flex flex-col p-[50px] px-[60px]'>
                    <h1 className='text-[35px] font-semibold mb-[5px]'>Change Wallet</h1>
                    <p className='pl-[5px]'>Change your wallet balance here</p>

                    <div className='flex flex-col gap-y-[30px] mt-[50px]'>
                        <input type="text" placeholder='Enter new wallet balance' className='border border-[#dddddd] p-[10px] rounded-md  min-w-[350px]' value={wallet} onChange={handleWallet} />
                        <button className='bg-[#7140de] hover:bg-[#8451f5] text-white flex px-[30px] py-[10px] self-end rounded-md font-medium ' onClick={saveWalletChange}>Save</button>
                    </div>
                </div>
            </Dialog>
            
            <div className='w-0'>
                <Toaster position="top-right" richColors />
            </div>
        </div>
    )
}

export default RootLayout