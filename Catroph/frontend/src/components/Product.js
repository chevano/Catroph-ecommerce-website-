import React from 'react'
import Rating from './Rating';
import { Link } from 'react-router-dom';

export default function Product(props) {
    // fetches the product object from props
    const { product } = props;

    return (
        <div  
            className="card"> 
            <Link to={`/product/${product._id}`}>
                <img 
                    className="medium" 
                    src={product.image} 
                    alt={product.name}
                />
            </Link>

            <div className="card-body">     
                <Link to={`/product/${product._id}`}>
                    <h2>{product.name}</h2>
                </Link>
                
                <Rating 
                    rating={product.rating} 
                    numReviews={product.numReviews}
                ></Rating>
            </div>

            <div className="row">
                <div className="price">${product.price}</div>

                <div>
                    <Link to={`/seller/${product.seller._id}`}>
                        { product.seller.seller.sellerName }
                    </Link>
                </div>
            </div>
        </div>
    );
}