import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUserProfile } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

export default function ProfileScreen(props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [sellerName, setSellerName] = useState("");
    const [sellerLogo, setSellerLogo] = useState("");
    const [sellerSlogan, setSellerSlogan] = useState("");

    const userSignin = useSelector( state => state.userSignin);
    const { userInfo } = userSignin;

    const userDetails = useSelector( state => state.userDetails);
    const { loading, error, user } = userDetails;

    const userUpdateProfile = useSelector( state => state.userUpdateProfile);
    const { success: successUpdate, error: errorUpdate, loading: loadingUpdate} = userUpdateProfile;

    const dispatch = useDispatch();

    useEffect(() => {
        // If we haven't gotten the user credentails as yet 
        // from backend then go ahead and fetch it
        if(!user) {
            dispatch({ type: USER_UPDATE_PROFILE_RESET});
            dispatch(detailsUser(userInfo._id));
        }
        else {
            setName(user.name);
            setEmail(user.email);

            if(user.seller) {
                setSellerName(user.seller.sellerName);
                setSellerLogo(user.seller.sellerLogo);
                setSellerSlogan(user.seller.sellerSlogan);
            }
        }
    }, [dispatch, userInfo]);

    const submitHandler = (event) => {
        event.preventDefault();

        if(password !== confirmPassword)
            alert("Password and Confirm Password Does Not Match!");
        else {
            dispatch(updateUserProfile({ 
                userId: user._id, 
                name, 
                email, 
                password, 
                sellerName, 
                sellerLogo, 
                sellerSlogan 
            }));
        }
    };

    const[loadingUpload, setLoadingUpload] = useState(false);
    const [errorUpload, setErrorUpload] = useState("");
    
    // Sends an ajax request to backend to upload the file
    const uploadFileHandler = async (event) => {
        // Upload only the first selected file
        const file = event.target.files[0];
        const bodyFormData = new FormData();
        // Sets the name of the file to image
        bodyFormData.append("image", file);
        setLoadingUpload(true);

        try {
            const { data } = await Axios.post("/api/uploads", bodyFormData, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${userInfo.token}`
                }
            });
            setSellerLogo(data);
            setLoadingUpload(false);
        }
        catch(error) {
            setErrorUpload(error.message);
            setLoadingUpload(false);
        }
    };

    return (
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>User Profile</h1>
                </div>
                {
                    loading ? ( <LoadingBox></LoadingBox> )
                    :
                    error ? ( <MessageBox variant="danger">{error}</MessageBox> )
                    : (
                        <>
                            { loadingUpdate && (<LoadingBox></LoadingBox>) }
                            { errorUpdate && (<MessageBox variant="danger">{errorUpdate}</MessageBox> )}
                            { successUpdate && ( <MessageBox variant="success">Profile Updated Successfully</MessageBox> )}
                            <div>
                                <label htmlFor="name">Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Enter Name"
                                    value={name}
                                    onChange={ (event) => setName(event.target.value) }
                                ></input>
                            </div>

                            <div>
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter Email"
                                    value={email}
                                    onChange={ (event) => setEmail(event.target.value) }
                                ></input>
                            </div>

                            <div>
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter Password"
                                    onChange= { (event) => setPassword(event.target.value) }
                                ></input>
                            </div>

                            <div>
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Enter Confirm Password"
                                    onChange= { (event) => setConfirmPassword(event.target.value)}
                                ></input>
                            </div>

                            {
                                user.isSeller && (
                                    <>
                                        <div>
                                            <label htmlFor="sellerName">Seller Name</label>
                                            <input
                                                id="sellerName"
                                                type="text"
                                                placeholder="Enter Seller Name"
                                                onChange= { (event) => setSellerName(event.target.value) }
                                            ></input>
                                        </div>

                                        <div>
                                            <label htmlFor="sellerLogo">Seller Logo</label>
                                            <input
                                                id="sellerLogo"
                                                type="file"
                                                label="Choose Image"
                                                onChange={uploadFileHandler}
                                            ></input>

                                            { loadingUpload && <LoadingBox></LoadingBox> }
                                            { errorUpload && <MessageBox variant="danger">{errorUpload}</MessageBox> }
                                        </div>

                                        <div>
                                            <label htmlFor="sellerSlogan">Seller Slogan</label>
                                            <input
                                                id="sellerSlogan"
                                                type="text"
                                                placeholder="Enter Seller Slogan"
                                                onChange= { (event) => setSellerSlogan(event.target.value) }
                                            ></input>
                                        </div>
                                    </>
                                )
                            }
                            <div>
                                <label />
                                <button className="primary" type="submit">
                                    Update
                                </button>
                            </div>
                        </>
                    )
                }
            </form>
        </div>
    );
}

