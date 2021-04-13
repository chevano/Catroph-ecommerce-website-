import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, } from 'react-redux';
import { Link } from 'react-router-dom';
import { deliverOrder, detailsOrder, payOrder } from '../actions/orderActions';
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { ORDER_DELIVER_RESET, ORDER_PAY_RESET } from '../constants/orderConstants';

export default function OrderScreen(props) {
    // Hook for getting the status of paypal sdk
    const [sdkReady, setSdkReady] = useState(false);
    const orderId = props.match.params.id;

    const orderDetails = useSelector(state => state.orderDetails);
    const { order, loading, error } = orderDetails;

    const orderPay = useSelector( state => state.orderPay);
    const { loading: loadingPay, error: errorPay, success: successPay } = orderPay;

    const orderDeliver = useSelector( state => state.orderDeliver);
    const { loading: loadingDeliver, error: errorDeliver, success: successDeliver } = orderDeliver;

    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;

    const dispatch = useDispatch();

    useEffect(() => {
        const addPayPalScript = async () => {
            // Sends a request to backend to get the paypal client id
            const { data } = await axios.get("/api/config/paypal");
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
            script.async = true;
            // onload gets executed when script.src gets downloaded in the browser and is ready to be used
            script.onload = () => {
                setSdkReady(true);
            };
            // Adds script to the body of the html document
            document.body.appendChild(script);
        }
        // Loads the order from backend and or 
        // Update the UI based on changes made on the order
        if(!order || successPay || successDeliver || (order && order._id !== orderId)) {
            dispatch({ type: ORDER_PAY_RESET });
            dispatch({ type: ORDER_DELIVER_RESET });
            dispatch(detailsOrder(orderId));
        }
        else {
            // if the order has not yet been paid
            if(!order.isPaid) {
                // Checks if paypal hasn't been loaded yet, 
                // which could be the cause for an unpaid order
                if(!window.paypal) 
                    addPayPalScript();
                else
                    setSdkReady(true);
            }
        }
    }, [dispatch, order, orderId, sdkReady, successPay, successDeliver]);

    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(order, paymentResult));
    };

    const deliverHandler = () => {
        dispatch(deliverOrder(order._id));
    }

    return loading ? ( <LoadingBox></LoadingBox> ) 
            :
            error ? ( <MessageBox variant="danger">{error}</MessageBox> ) 
            :  ( 
        <div>
            <h1>Order {order._id}</h1>
            <div className="row top">
                <div className="col-2">
                    <ul>
                        {/* Shipping Section */}
                        <li>
                            <div className="card card-body">
                                <h2>Shipping</h2>

                                <p>
                                    <strong>Name:</strong> {" "}
                                    {order.shippingAddress.fullName}
                                    <br />

                                    <strong>Address:</strong> {" "}
                                    {order.shippingAddress.address}, {" "}
                                    {order.shippingAddress.city}, {" "}
                                    {order.shippingAddress.postalCode}, {" "}
                                    {order.shippingAddress.country} 
                                </p>

                                {/* Delivery Status */}

                                {
                                    order.isDelivered ? 
                                        <MessageBox variant="success">
                                            Delivered at {" "} {order.dateOfDelivery} 
                                        </MessageBox>
                                    :  
                                        <MessageBox variant="danger">
                                            Not Delivered
                                        </MessageBox>
                                }
                            </div>
                        </li>

                         {/* Payment Section */}
                        <li>
                            <div className="card card-body">
                                <h2>Payment</h2>

                                <p>
                                    <strong>Method:</strong> {" "}
                                    {order.paymentMethod}
                                </p>

                                {/* Purchase Status */}
                                
                                {
                                    order.isPaid ? 
                                        <MessageBox variant="success">
                                            Purchase at {" "} {order.dateOfPurchase} 
                                        </MessageBox>
                                    :  
                                        <MessageBox variant="danger">
                                            Not Paid
                                        </MessageBox>
                                }
                            </div>
                        </li>

                         {/* Order Item Section */}
                        <li>
                            <div className="card card-body">
                                <h2>Order Item</h2>

                                <ul> {
                                    order.orderItems.map((item) => (
                                        <li key = {item.product}>
                                            <div className="row">
                                                <div>
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="small"
                                                    ></img>
                                                </div>

                                                {/* Should be the biggest section on the page */}
                                                <div className="small">
                                                    <Link to={`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </div>

                                                <div className="small">
                                                    {item.qty} x ${item.price} = ${item.qty * item.price}
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                }
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="col-1">
                    <div className="card card-body">
                        <ul>
                            <li>
                                <h2>Order Summary</h2>
                            </li>

                            <li>
                                <div className="row">
                                    <div>Subtotal</div>
                                    <div>${order.itemsPrice.toFixed(2)}</div>
                                </div>
                            </li>

                            <li>
                                <div className="row">
                                    <div>Shipping</div>
                                    <div>${order.shippingPrice.toFixed(2)}</div>
                                </div>
                            </li>

                            <li>
                                <div className="row">
                                    <div>Tax</div>
                                    <div>${order.taxPrice.toFixed(2)}</div>
                                </div>
                            </li>

                            <li>
                                <div className="row">
                                    <div>
                                        <strong>Total</strong>
                                    </div>

                                    <div>
                                        <strong>${order.totalPrice.toFixed(2)}</strong>
                                    </div>
                                </div>
                            </li>

                            {
                                !order.isPaid && (
                                    <li>
                                        { 
                                            !sdkReady ? (<LoadingBox></LoadingBox>)
                                            :
                                            (
                                                <>
                                                    { errorPay && <MessageBox variant="danger">{errorPay}</MessageBox>}
                                                    { loadingPay && <LoadingBox></LoadingBox>}
                                                    <PayPalButton 
                                                        amount={order.totalPrice}
                                                        onSuccess={successPaymentHandler}
                                                    ></PayPalButton>
                                                </>
                                            )
                                        }
                                    </li>
                                )
                            }
                            {
                                userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                                    <li>
                                        { loadingDeliver && <LoadingBox></LoadingBox>}
                                        { errorDeliver && <MessageBox variant="danger">{errorDeliver}</MessageBox>}
                                        <button
                                            type="button"
                                            onClick={deliverHandler}
                                            className="primary block"
                                        >
                                            Deliver Order
                                        </button>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}