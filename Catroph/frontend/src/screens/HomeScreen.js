import React, { useEffect } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import Product from '../components/Product';
import MessageBox from '../components/MessageBox';
import LoadingBox from '../components/LoadingBox';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
import { listTopSellers } from '../actions/userActions';
import { Link } from 'react-router-dom';

export default function HomeScreen() {
  const productList = useSelector( state => state.productList);
  const { loading, error, products } = productList;

  const userTopSellersList = useSelector( state => state.userTopSellersList);
  const { 
      loading: loadingSellers, 
      error: errorSellers,
      users: sellers
    } = userTopSellersList;

  const dispatch = useDispatch();
    // Performs data fetching side-effects
    useEffect(() => {
        // Loads all the products from backend
        dispatch(listProducts({}));
        // Loads the top five sellers from backend
        dispatch(listTopSellers());
    }, [dispatch]);

    return (
        <div> 
            <h2>Top Sellers</h2>

            { 
                loadingSellers ? <LoadingBox></LoadingBox>
                :
                errorSellers ? <MessageBox>{errorSellers}</MessageBox>
                :
                <>
                    { sellers.length === 0 && <MessageBox>No Seller Found</MessageBox> }
                    <Carousel showArrows autoPlay showThumbs={false}>
                        { sellers.map((seller) => (
                            <div key={seller._id}>
                                <Link to={`/seller/${seller._id}`}>
                                    <img src={ seller.seller.sellerLogo } alt={seller.seller.sellerName}/>
                                    <p className="legend">{seller.seller.sellerName}</p>
                                </Link>
                            </div>
                        ))}
                    </Carousel> 
                </>
            }

            <h2>Featured Products</h2>

            {
                loading ? ( <LoadingBox></LoadingBox> )
                : 
                error ? ( <MessageBox variant="danger">{error}</MessageBox> )
                : 
                <>
                    { products.length === 0 && <MessageBox>No Product Found</MessageBox> }
                    <div className="row center"> {
                        
                        products.map( (product) => (
                            <Product 
                                key={product._id} 
                                product={product}
                            ></Product>
                        ))
                    }
                    </div>  
                </>
            } 
        </div>
    );
}