import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';

// Only logged in users can gain access to contents inside PrivateRoute
export default function PrivateRoute({ component: Component, ...rest}) {
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;

    return (
        <Route 
        { ...rest } 
        render={(props) => 
            userInfo ? ( <Component {...props}></Component>)
            :
            <Redirect to="signin"/>
        }
        ></Route>
    );
}