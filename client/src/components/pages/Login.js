import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { setAuth } from '../../slices/authSlice';

function Login() {

    const dispatch = useDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL+"/api/user/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
        });

        const data = await response.json();
        console.log(data)

        if(data.token){
            localStorage.setItem('user', JSON.stringify(data));
            dispatch(setAuth(data));
        }
    }

    return (
        <div className='h-screen w-screen flex items-center justify-center'>
            <div className='flex flex-col gap-x-[20px]'>
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    )
}

export default Login