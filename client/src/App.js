
import './App.css';
import React, { useEffect } from "react";
import {
  RouterProvider,
  createBrowserRouter
} from "react-router-dom";
import About from './components/pages/About';
import Home from './components/pages/Home';
import RootLayout from './components/RootLayout';
import Market from './components/pages/Market';
import IndividualStock from './components/pages/IndividualStock';
import Login from './components/pages/Login';

import { useDispatch, useSelector } from 'react-redux';
import { setAuth } from './slices/authSlice';

function App() {

  const user = useSelector((state) => state.auth.user);

  const router = createBrowserRouter(
    [
      {
        path: "",
        element:  !user? <Login /> :<RootLayout />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "about",
            element: <About />,
          },
          {
            path: "market",
            element: <Market />,
          },
          {
            path: "stock/:symbol",
            element: <IndividualStock />,
          },
        ],
      },
    ]
  );

  const dispatch = useDispatch();

  useEffect(() => {

    (async function () {

      const userFromLS = JSON.parse(localStorage.getItem('user'));

      if (!userFromLS) {
        return;
      }
      
      const response = await fetch(process.env.REACT_APP_BACKEND_URL+'/api/user/reauth', {
        method: 'GET',
        headers: {
          'Content-Type': 'application',
          'Authorization': `Bearer ${userFromLS.token}`
        }
      });

      const data = await response.json();

      if (data.error) {
        localStorage.removeItem('user');
        dispatch(setAuth(null));
      }
      else{
        dispatch(setAuth(data));
      }
  
      // if (userFromLS && !user) {
      //   dispatch(setAuth(userFromLS));
      // }

    })()

  },[dispatch]);

  return (
    <RouterProvider router={router} />
  );
}

export default App;
