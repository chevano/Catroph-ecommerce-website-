import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsUser, updateUser } from '../actions/userActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { USER_UPDATE_RESET } from '../constants/userConstants';

export default function UserEditScreen(props) {
    const userId = props.match.params.id;

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isSeller, setIsSeller] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const userDetails = useSelector((state) => state.userDetails);
    const {loading, error, user } = userDetails;

    const userUpdate = useSelector((state) => state.userUpdate);
    const { 
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate
    } = userUpdate;

    const dispatch = useDispatch();

    useEffect(() => {
        if(successUpdate) {
            dispatch({ type: USER_UPDATE_RESET});
            props.history.push(`/userList`);
        }

        // If we couldn't find the user then load the product from backend
        if(!user || user._id !== userId || successUpdate) {
            dispatch({ type: USER_UPDATE_RESET});
            dispatch(detailsUser(userId));
        }
        else {
            setName(user.name);
            setEmail(user.email);
            setIsSeller(user.isSeller);
            setIsAdmin(user.isAdmin);
        }
    },[dispatch, user, userId, successUpdate, props.history]);

    const submitHandler = (event) => {
        event.preventDefault();
        dispatch(updateUser({ _id: userId, name, email, isSeller, isAdmin }));
    };

    return(
        <div>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1>Edit User {name}</h1>
                </div>

                { loadingUpdate && <LoadingBox></LoadingBox>}
                { errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
                { successUpdate && <MessageBox variant="success">User has been Successfully Updated</MessageBox>}

                { 
                    loading ? <LoadingBox></LoadingBox>
                    :
                    error ? <MessageBox>{error}</MessageBox>
                    :
                    <>
                        <div>
                            <label htmlFor="name">Name</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Enter Name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            ></input>
                        </div>

                        <div>
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            ></input>
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
                            <label htmlFor="isAdmin">Admin</label>
                            <input
                                id="isAdmin"
                                type="checkbox"
                                checked={isAdmin}
                                onChange={(event) => setIsAdmin(event.target.checked)}
                            ></input>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="primary"
                            >
                                Update
                            </button>
                        </div>
                    </>
                }
            </form>
        </div>
    );
}