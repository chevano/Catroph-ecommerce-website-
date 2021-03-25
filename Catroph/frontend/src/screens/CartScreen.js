import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart, removeFromCart } from '../actions/cartActions';
import MessageBox from '../components/MessageBox';

export default function CartScreen(props) {
    const productId = props.match.params.id;
    const qty = props.location.search ? Number(props.location.search.split("=")[1]) : 1;
    const cart = useSelector(state => state.cart);
    const { cartItems } = cart;
    const dispatch = useDispatch();

    useEffect(() => {
        // Add the product to the shopping cart if it exist
        if(productId) {
            dispatch(addToCart(productId, qty));
        }
    }, [dispatch, productId, qty]);

    const removeFromCartHandler = (idOfProduct) => {
        dispatch( removeFromCart(idOfProduct) );
    };

    const checkoutHandler = () => {
        // direct user to sigin screen
        props.history.push('sigin?redirect=shipping');
    };

    return (
        <div className="row top">
            <div className="col-2">
                <h1>Shopping Cart</h1>
                {
                    cartItems.length === 0 
                    ?    <MessageBox>
                            Cart is empty.
                            <Link to="/">Go Shopping</Link>
                        </MessageBox>
                    : (
                        <ul> {
                            cartItems.map((item) => (
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
                                        <div className="min-30rem">
                                            <Link to={`/product/${item.product}`}>
                                                {item.name}
                                            </Link>
                                        </div>

                                        <div>
                                            {/* Stores the selected item from the select box */}
                                            <select
                                                value={item.qty}
                                                onChange={e =>
                                                    dispatch(
                                                        addToCart(item.product, Number(e.target.value))  
                                                    )
                                                }
                                            >
                                                {
                                                    /* Returns the number of items in stock (from 0 to countInStock - 1)*/
                                                    [...Array(item.countInStock).keys()].map(x => (
                                                        <option 
                                                            key = {x + 1} 
                                                            value = {x + 1}>{x + 1}
                                                        </option>
                                                    )) 
                                                }
                                            </select>
                                        </div>

                                        <div>
                                            ${item.price}
                                        </div>

                                        <div>
                                            <button 
                                                    type="button"
                                                    onClick={() => removeFromCartHandler(item.product)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))
                        }
                        </ul>
                    )
                }
            </div>

            <div className="col-1">
                <div className="card card-body">
                    <ul>
                        <li>
                            <h2>
                                Subtotal (
                                    { 
                                        cartItems.reduce((accumulator, currentProduct) => 
                                            accumulator + currentProduct.qty, 0)
                                    } items) 
                                : $
                                { 
                                    cartItems.reduce((accumulator, currentProduct) =>
                                        accumulator + currentProduct.price * currentProduct.qty, 0)
                                }
                            </h2>
                        </li>

                        <li>
                            <button 
                                type="button"
                                onClick={checkoutHandler}
                                className="primary block"
                                disabled={cartItems.length === 0}
                            >
                                Proceed to Checkout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
            
        </div>
    );
}