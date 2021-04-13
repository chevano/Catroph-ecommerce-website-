import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { register } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

export default function RegisterScreen(props) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSeller, setIsSeller] = useState(false);

    // Searches the query string for the info on the right-hand side of = sign
    const redirect = props.location.search ? props.location.search.split('=')[1] : "/";

    const userRegister = useSelector(state => state.userRegister);
    const { userInfo, loading, error } = userRegister;

    const dispatch = useDispatch();

    const submitHandler = (event) => {
        event.preventDefault(); // Prevents page from refreshing and prevents post back to another page

        if(password !== confirmPassword)
            alert("Passwords do not match!");
        else
            dispatch(register(name, email, password, isSeller));
    };

    useEffect(() => {
        if(userInfo)
            props.history.push(redirect);
    }, [props.history, redirect, userInfo]);

    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Register</h1>
                </div>

                {loading && <LoadingBox></LoadingBox>}
                {error && <MessageBox variant="danger">{error}</MessageBox>}
                
                <div>
                    <label htmlFor="name">Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        placeholder="Enter Name" required
                        onChange={e => setName(e.target.value)}>    
                    </input>
                </div>

                <div>
                    <label htmlFor="email">Email Address</label>
                    <input 
                        type="email" 
                        id="email" 
                        placeholder="Enter Email Address" required
                        onChange={e => setEmail(e.target.value)}>    
                    </input>
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        placeholder="Enter Password" required
                        onChange={e => setPassword(e.target.value)}>    
                    </input>
                </div>

                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        placeholder="Confirm Password" required
                        onChange={e => setConfirmPassword(e.target.value)}>    
                    </input>
                </div>

                <div>
                    <label htmlFor="isSeller">Seller</label>
                    <input
                        id="isSeller"
                        type="checkbox"
                        checked={isSeller}
                        onChange={(event) => setIsSeller(event.target.checked)}
                    ></input>
                </div>

                <div>
                    <label />
                    <button className="primary" type="submit">
                        Register
                    </button>
                </div>

                <div>
                    <label />
                    <div>
                        Already have an account? {" "}
                        <Link to={`/signin?redirect=${redirect}`}>Sign In</Link>
                    </div>
                </div>
            </form>
        </div>
    );
}