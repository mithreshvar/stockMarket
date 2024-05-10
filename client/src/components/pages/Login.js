import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { setAuth } from '../../slices/authSlice';
import StoreIcon from '../../Icons/StoreIcon';
import { TbEyeClosed, TbEye   } from "react-icons/tb";
import { toast, Toaster } from 'sonner';

import { dotSpinner, helix } from 'ldrs'

dotSpinner.register()
helix.register()

function Login() {

    const dispatch = useDispatch();

    const [viewPassword, setViewPassword] = useState(false)
    const [activePage, setActivePage] = useState('Log in'); 
    const [loading, setLoading] = useState(false);
    const [backendIsStarting, setBackendIsStarting] = useState(false);  // for render backend to spin up as it is in free tier

    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')

    const handleLogin = async () => {

        setLoading(true);
        setTimeout(() => {
            setBackendIsStarting(true);
        }, 10000)

        const response = await fetch(process.env.REACT_APP_BACKEND_URL+"/api/user/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });

        const data = await response.json();
        console.log(data)
        if(data.error) {
            toast.error(data.error)
        }

        if(data.token){
            localStorage.setItem('user', JSON.stringify(data));
            dispatch(setAuth(data));
        }

        setBackendIsStarting(false);
        setLoading(false);
    }

    const handleSignup = async () => {
        if(password !== confirmPassword){
            toast.error("Passwords do not match")
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setBackendIsStarting(true);
        }, 10000)

        const response = await fetch(process.env.REACT_APP_BACKEND_URL+"/api/user/signup", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, email, password})
        });

        const data = await response.json();
        console.log(data)
        if(data.error) {
            toast.error(data.error)
        }

        if(data.token){
            localStorage.setItem('user', JSON.stringify(data));
            dispatch(setAuth(data));
        }
        
        setBackendIsStarting(false);
        setLoading(false);
    }

    useEffect(() => {
        if (!loading && backendIsStarting) {
            setBackendIsStarting(false);
        }
    }, [loading, backendIsStarting])

    return (
        <div className='h-screen w-screen flex items-center justify-center bg-[#fbffd4] relative '>
            {
                backendIsStarting &&
                <div className='absolute flex justify-center items-center font-medium gap-x-[10px] top-[40px] right-[30px] bg-white rounded-[10px] shadow-[10px_10px_20px_0px_#000000dd] px-[30px] p-[15px] '>

                    <l-helix
                        size="45"
                        speed="2.5" 
                        color="black"
                    ></l-helix>
                    <div className='flex flex-col text-[#545454]'>
                        <p>Backend is starting up.</p>
                        <p>Please wait...</p>
                    </div>
                </div>
            }

            <div className='flex flex-col gap-y-[30px]'>
                <h1 className='flex gap-x-[15px] items-center justify-center text-[22px]'>
                    <StoreIcon className="h-[60px] w-[60px]" />
                    <span className='text-[48px] font-bold'>Stockify</span>
                </h1>
                <div className='flex flex-col gap-y-[20px] border border-[#00000080] rounded-lg px-[50px] p-[40px] min-w-[350px] shadow-[20px_25px_60px_-12px] bg-[#f8f8ff]'>
                    <div className='flex flex-col gap-y-[10px] mb-[15px]'>
                        <h1 className='text-[40px] font-bold'>{ activePage==='Log in' ? 'Log in' : 'Sign in' }</h1>
                        {
                            activePage === 'Log in' ?
                                <p className='text-[#545454]'>Enter your email and password to access your account.</p>
                            :
                                <p className='text-[#545454]'>Join our platform and start exploring the features.</p>
                        }
                    </div>

                    {
                        activePage === 'Log in' ?
                        <p className='text-[18px] mb-[18px] font-medium'>Not a member yet? <span className='font-bold text-[#4147C0] cursor-pointer ' onClick={() => setActivePage('Sign in')}>Sign up here</span>.</p>
                        :
                        <p className='text-[18px] mb-[18px] font-medium'>Already have an account? <span className='font-bold text-[#4147C0] cursor-pointer ' onClick={() => setActivePage('Log in')}>Log in</span>.</p>
                    }

                    <div className={` grid ${ activePage==='Sign in' && " grid-cols-2 "} gap-[20px] gap-x-[40px] `}>
                        {
                            activePage === 'Sign in' &&
                            <>
                                <div className='flex flex-col gap-y-[6px]'>
                                    <label className='text-[18px] font-medium pl-[7px]'>Full Name</label>
                                    <input className='border border-[#00000040] rounded-md px-[10px] p-[3px] text-[20px]' type="text" placeholder="John Smith" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                            </>
                        }
                        <div className='flex flex-col gap-y-[6px]'>
                            <label className='text-[18px] font-medium pl-[7px]'>Email</label>
                            <input className='border border-[#00000040] rounded-md px-[10px] p-[3px] text-[20px] w-full' type="text" placeholder="example@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className='flex flex-col gap-y-[6px]'>
                            <label className='text-[18px] font-medium pl-[7px]'>Password</label>
                            <div className='relative'>
                                <input className='border border-[#00000040] rounded-md px-[10px] p-[3px] text-[20px] w-full' type={viewPassword ? "text" : "password"} placeholder="*********" value={password} onChange={(e) => setPassword(e.target.value)} />
                                {
                                    password!=='' &&
                                    <span onClick={() => setViewPassword(!viewPassword)} className='absolute text-[25px] right-[15px] top-[50%] -translate-y-1/2 cursor-pointer'>{ viewPassword ? <TbEyeClosed /> : <TbEye /> }</span>
                                }
                            </div>
                        </div>
                        {
                            activePage === 'Sign in' &&
                            <div className='flex flex-col gap-y-[6px]'>
                                <label className='text-[18px] font-medium pl-[7px]'>Confirm Password</label>

                                <div className='relative'>
                                    <input className='border border-[#00000040] rounded-md px-[10px] p-[3px] text-[20px]' type={viewPassword ? "text" : "password"} placeholder="*********" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                    {
                                        confirmPassword!=='' &&
                                        <span onClick={() => setViewPassword(!viewPassword)} className='absolute text-[25px] right-[15px] top-[50%] -translate-y-1/2 cursor-pointer'>{ viewPassword ? <TbEyeClosed /> : <TbEye /> }</span>
                                    }
                                </div>
                            </div>
                        }
                    </div>

                    <button onClick={ activePage==='Log in' ? handleLogin : handleSignup} className='w-[155px] bg-[#24855B] hover:bg-[#2da671] disabled:bg-[#51645c] disabled:opacity-80 px-[20px] self-end p-[8px] rounded-[10px] mt-[30px] text-white font-bold text-[20px] ' disabled={loading}>
                        { loading ? 
                            <div className='flex gap-x-[10px] justify-center items-center'>
                                <p >Loading</p>
                                <l-dot-spinner
                                    size="22"
                                    speed="1" 
                                    color="white" 
                                ></l-dot-spinner>
                            </div> 
                            :
                            'Next'
                        }
                    </button>
                </div>
            </div>
            <div className='w-0'>
                <Toaster position="top-right" richColors />
            </div>
        </div>
    )
}

export default Login