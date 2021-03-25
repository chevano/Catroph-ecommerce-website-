import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector  } from 'react-redux';
import Rating from '../components/Rating';
import { Link } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { detailsProduct } from '../actions/productActions';

export default function ProductScreen(props) {

    // React-Redux hook
    const dispatch = useDispatch();
    const productId = props.match.params.id;
    const [qty, setQty] = useState(1);

    // React hook inside react-redux to load the products from productDetails in redux store
    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails;

    

    useEffect(() => {
        dispatch(detailsProduct(productId));
    }, [dispatch, productId]);

    const addToCartHandler = () => {
        // Changes the route in the application
        props.history.push(`/cart/${productId}?qty=${qty}`);
    };

    return (

        <div> {
            loading ? ( <LoadingBox></LoadingBox> )
            : error ? ( <MessageBox variant="danger">{error}</MessageBox> )
            : ( 
                // Divides the page into three sections
                <div>
                    <Link to="/">Back</Link>
                     <div className="row top">

                        <div className="col-2">
                            <img 
                                className="large"
                                src={product.image} 
                                alt={product.name}
                            ></img>
                        </div>

                        <div className="col-1">
                            <ul>
                                <li>
                                    <h1>{product.name}</h1>
                                </li>

                                <li>
                                    <Rating 
                                        rating={product.rating}
                                        numReviews={product.numReviews}
                                    ></Rating>
                                </li>

                                <li>
                                    Price: ${product.price}
                                </li>

                                <li>
                                    Desciption: <p>{product.description}</p>
                                </li>
                            </ul>
                        </div>

                        <div className="col-1">
                            <div className="card card-body">
                                <ul>
                                    <li>
                                        <div className="row">
                                            <div>Price</div>
                                            <div className="price">${product.price}</div>
                                        </div>
                                    </li>

                                    <li>
                                        <div className="row">
                                            <div>Stock</div> 
                                            <div> {
                                                product.countInStock > 0
                                                ? ( <span className="success">In Stock</span> )
                                                : ( <span className="danger">Unavailable</span> )
                                            }
                                            </div>
                                        </div>
                                    </li>
                                    {
                                        product.countInStock > 0 && (
                                            <> { /*Empty Container to group */}
                                                <li>
                                                    <div className="row">
                                                        <div>Qty</div>

                                                        <div>
                                                            <select 
                                                                value={qty}
                                                                onChange={e => setQty(e.target.value)}
                                                            >
                                                                {
                                                                    /* Returns the number of items in stock (from 0 to countInStock - 1)*/
                                                                    [...Array(product.countInStock).keys()].map(x => (
                                                                        <option 
                                                                            key = {x + 1} 
                                                                            value = {x + 1}>{x + 1}
                                                                        </option>
                                                                    )) 
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                </li>

                                                <li>
                                                    <button 
                                                        className="primary block"
                                                        onClick={addToCartHandler}>Add to Cart</button>
                                                </li>
                                            </>
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
              )
        } 
        </div>
    )
}