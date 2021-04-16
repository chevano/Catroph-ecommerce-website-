import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

export default function ShippingAddressScreen(props) {

    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    // Forces user to log in before entering shipping address
    if(!userInfo)
        props.history.push("/signin");

    // Get shipping address from redux store
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const userAddressMap = useSelector((state) => state.userAddressMap);
    const { address: addressMap } = userAddressMap;

    const [lat, setLat] = useState(shippingAddress.lat);
    const [lng, setLng] = useState(shippingAddress.lng);

    const[fullName, setFullName] = useState(shippingAddress.fullName);
    const[address, setAddress] = useState(shippingAddress.address);
    const[city, setCity] = useState(shippingAddress.city);
    const[postalCode, setPostalCode] = useState(shippingAddress.postalCode);
    const[country, setCountry] = useState(shippingAddress.country);

    const dispatch = useDispatch();

    const submitHandler = (event) => {
        event.preventDefault();
        const newLat = addressMap ? addressMap.lat : lat;
        const newLng = addressMap ? addressMap.lng : lng;

        if(addressMap) {
            setLat(addressMap.lat);
            setLng(addressMap.lng);
        }

        let moveOn = true;
        if(!newLat || !newLng) {
            moveOn = window.confirm( "You forgot to set your location. Continue?");
        }

        if(moveOn) {
            dispatch(
                saveShippingAddress({
                    fullName, 
                    address, 
                    city, 
                    postalCode, 
                    country,
                    lat: newLat,
                    lng: newLng
                })
            );
            props.history.push("/payment");
        }
    };
    
    const chooseOnMap = () => {
        dispatch(
            saveShippingAddress({
                fullName, 
                address, 
                city, 
                postalCode, 
                country,
                lat,
                lng
            })
        );
        // Redirect user to the map screen
        props.history.push("/map");
    };

    return (
        <div>
            <CheckoutSteps step1 step2></CheckoutSteps>
            <form className="form" onSubmit={submitHandler}>
                <div>
                    <h1> Shipping Address</h1>
                </div>

                <div>
                    <label htmlFor="fullName">Full Name</label>
                    <input 
                        type="text"
                        id="fullName"
                        placeholder="Enter Full Name"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)} required
                    ></input>
                </div>

                <div>
                    <label htmlFor="address">Address</label>
                    <input 
                        type="text"
                        id="address"
                        placeholder="Enter Address"
                        value={address}
                        onChange={e => setAddress(e.target.value)} required
                    ></input>
                </div>

                <div>
                    <label htmlFor="city">City</label>
                    <input 
                        type="text"
                        id="city"
                        placeholder="Enter City"
                        value={city}
                        onChange={e => setCity(e.target.value)} required
                    ></input>
                </div>

                <div>
                    <label htmlFor="postalCode">Postal Code</label>
                    <input 
                        type="text"
                        id="postalCode"
                        placeholder="Enter Postal Code"
                        value={postalCode}
                        onChange={e => setPostalCode(e.target.value)} required
                    ></input>
                </div>

                <div>
                    <label htmlFor="country">Country</label>
                    <input 
                        type="text"
                        id="country"
                        placeholder="Enter Country"
                        value={country}
                        onChange={e => setCountry(e.target.value)} required
                    ></input>
                </div>

                <div>
                    <label htmlFor="chooseOnMap">Location</label>
                    <button type="button" onClick={chooseOnMap}>
                        Use Google Maps
                    </button>
                </div>
                <div>
                    <label />
                    <button className="primary" type="submit">Continue</button>
                </div>
            </form>
        </div>
    );
}