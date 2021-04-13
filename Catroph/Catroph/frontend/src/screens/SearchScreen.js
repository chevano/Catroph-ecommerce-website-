import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { listProducts } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Product from '../components/Product';
import Rating from '../components/Rating';
import { prices, ratings } from '../utils';

export default function SearchScreen(props) { 
    const { 
        name = "all", 
        category = "all", 
        min = 0, 
        max = 0, 
        rating = 0,
        order = "newest" 
    } = useParams();

    const productList = useSelector((state) => state.productList);
    const { loading, error, products } = productList;

    const productCategoryList = useSelector((state) => state.productCategoryList);
    const { loading: loadingCategories, error: errorCategories, categories } = productCategoryList;
 
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(listProducts({ 
            name: name !== "all" ? name: "",
            category: category !== "all" ? category : "",
            min,
            max,
            rating,
            order
        }));
    }, [dispatch, name, category, min, max, rating, order]);

    const getFilterUrl = (filter) => {
        const filterCategory = filter.category || category;
        const filterName = filter.name || name;
        const sortOrder = filter.order || order;
        const filterRating = filter.rating ? filter.rating : filter.rating === 0 ? 0 : rating;
        const filterMin = filter.min ? filter.min : filter.min === 0 ? 0 : min;
        const filterMax = filter.max ? filter.max : filter.max === 0 ? 0 : max;
        return `/search/category/${filterCategory}/name/${filterName}/min/${filterMin}/max/${filterMax}/rating/${filterRating}/order/${sortOrder}`;
    };

    return (
        <div>
            <div className="row">
                {
                    loading ? <LoadingBox></LoadingBox>
                    :
                    error ? <MessageBox variant="danger">{error}</MessageBox>
                    :
                    <div>
                        {products.length} Results
                    </div>
                }

                <div>
                    Sort by {" "}
                    <select 
                        value={order}
                        onChange={ (event) => { props.history.push(getFilterUrl({ order: event.target.value }))}}
                    >
                        <option value="newest">Newest Arrival</option>
                        <option value="lowest">Price: Low to High</option>
                        <option value="highest">Price: High to Low</option>
                        <option value="toprated">Customer Reviews</option>
                    </select>
                </div>
            </div>

            <div className="row top">
                <div className="col-1">
                    <h3>Department</h3>

                    <div>
                    {
                        loadingCategories ? <LoadingBox></LoadingBox>
                        :
                        errorCategories ? <MessageBox variant="danger">{errorCategories}</MessageBox>
                        :
                        <ul>
                            <li>
                                <Link
                                    className={"all" === category ? "active" : ""} 
                                    to= {getFilterUrl({ category: "all" })}> Any 
                                </Link>
                            </li>
                            {
                                categories.map( c => (
                                    <li key={c}>
                                        <Link
                                            className={c === category ? "active" : ""} 
                                            to= {getFilterUrl({ category: c })}> {c} 
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    }
                    </div>

                    <div>
                        <h3>Price</h3>
                        <ul>
                            {
                                prices.map((price) => (
                                    <li key={price.name}>
                                        <Link 
                                            className={ `${price.min} - ${price.max}` === `${min} - ${max}` ? "active" : ""}
                                            to={ getFilterUrl({ min: price.min, max: price.max }) }
                                        >
                                            {price.name}
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>

                    <div>
                        <h3>Customer Review</h3>
                        <ul>
                            {
                                ratings.map((r) => (
                                    <li key={r.name}>
                                        <Link 
                                            className={ `${r.rating}` === `${rating}` ? "active" : ""}
                                            to={ getFilterUrl({ rating: r.rating }) }
                                        >
                                            <Rating
                                                caption={" and above"}
                                                rating={r.rating}
                                            ></Rating>
                                        </Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                </div>

                <div className="col-3">
                {
                    loading ? <LoadingBox></LoadingBox>
                    :
                    error ? <MessageBox variant="danger">{error}</MessageBox>
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
            </div>

        </div>
        
    );
}