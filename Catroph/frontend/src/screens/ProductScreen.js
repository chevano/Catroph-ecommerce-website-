import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector  } from 'react-redux';
import Rating from '../components/Rating';
import { Link } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { createReview, detailsProduct } from '../actions/productActions';
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants';

export default function ProductScreen(props) {
    const productId = props.match.params.id;

    const dispatch = useDispatch();
    const [qty, setQty] = useState(1);

    // Load the select product details from productDetails inside redux store
    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails;

    // Load the user credentials from userSignin inside redux store
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    // Load the newly create review details by the user from productCreateReview inside redux store
    const productCreateReview = useSelector((state) => state.productCreateReview);
    const { 
        loading: loadingCreatedReview, 
        error: errorCreatedReview, 
        success: successCreatedReview 
    } = productCreateReview;

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    useEffect(() => {
        if(successCreatedReview) {
            window.alert("Review Submitted Successfully");
            setRating("");
            setComment("");
            dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
        }

        dispatch(detailsProduct(productId));
    }, [dispatch, productId, successCreatedReview]);

    const addToCartHandler = () => {
        // Changes the route in the application
        props.history.push(`/cart/${productId}?qty=${qty}`);
    };

    const submitHandler = (event) => {
        event.preventDefault();
        if( comment && rating) 
            dispatch(createReview(productId, { rating: Number(rating), comment, name: userInfo.name }));
        else 
            alert("Please enter comment and rating")
    };

    return (

        <div> {
            loading ? ( <LoadingBox></LoadingBox> )
            : error ? ( <MessageBox variant="danger">{error}</MessageBox> )
            : ( 
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
                                        Seller 
                                        <h2>
                                            <Link to={`/seller/${product.seller._id}`}>
                                                { product.seller.seller.sellerName }
                                            </Link>
                                        </h2>

                                        <Rating
                                            rating={product.seller.seller.sellerRating}
                                            numReviews={product.seller.seller.sellerNumReviews}
                                        ></Rating>
                                    </li>
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

                    <div>
                        <h2 id="reviews">Reviews</h2>
                        { product.reviews.length === 0 && (
                            <MessageBox>Please add a review.</MessageBox>
                        )}
                        <ul>
                            { product.reviews.map((review) => (
                                <li key={review._id}>
                                    <strong>{review.name}</strong>
                                    <Rating
                                        rating={review.rating}
                                        caption=" " 
                                    ></Rating>
                                    <p>{review.createdAt.substring(0,10)}</p>
                                    <p>{review.comment}</p>
                                </li>
                            ))}
                            <li>
                                {
                                    userInfo ? (
                                        <form className="form" onSubmit={submitHandler}>
                                            <div>
                                                <h2>Create a customer review</h2>
                                            </div>
                                            
                                            <div>
                                                <label htmlFor="rating">Rating</label>
                                                <select 
                                                    id="rating" 
                                                    value={rating}
                                                    onChange= { (event) => setRating(event.target.value) }
                                                >
                                                    <option value="">Select...</option>
                                                    <option vlaue="1">1 - Poor</option>
                                                    <option vlaue="2">2 - Fair</option>
                                                    <option vlaue="3">3 - Good</option>
                                                    <option vlaue="4">4 - Very good</option>
                                                    <option vlaue="5">5 - Excellent</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label htmlFor="comment">Comment</label>
                                                <textarea
                                                    id="comment"
                                                    value={comment}
                                                    onChange={ (event) => setComment(event.target.value) }       
                                                ></textarea>
                                            </div>

                                            <div>
                                                <label/>
                                                <button className="primary" type="submit">Submit</button>
                                            </div>

                                            <div>
                                            { loadingCreatedReview && <LoadingBox></LoadingBox> }
                                            { errorCreatedReview && <MessageBox>{errorCreatedReview}</MessageBox> }
                                            </div>
                                        </form>
                                    )
                                    : (
                                        <MessageBox>
                                            Please <Link to="/signin">Sign In</Link> to write a review
                                        </MessageBox>
                                    )
                                }
                            </li>
                        </ul>
                    </div>
                </div>
              )
        } 
        </div>
    )
}