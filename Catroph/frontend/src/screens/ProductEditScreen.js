import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { detailsProduct, updateProduct } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants';

export default function ProductEditScreen(props) {
    const productId = props.match.params.id;

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [category, setCategory] = useState("");
    const [countInStock, setCountInStock] = useState("");
    const [brand, setBrand] = useState("");
    const [description, setDescription] = useState("");

    const productDetails = useSelector(state => state.productDetails);
    const { loading, error, product } = productDetails;

    const productUpdate = useSelector(state => state.productUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate
    } = productUpdate;

    const dispatch = useDispatch();

    useEffect(() => {
        if(successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET });
            props.history.push("/productList");
        }
        // If we couldn't find the product then load the product from backend
        if(!product || product._id !== productId || successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET });
            dispatch(detailsProduct(productId));
        }
        // If such a product exist then set the fields in the UI with the data from backend 
        else {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setBrand(product.brand);
            setDescription(product.description);
        }
    }, [dispatch, product, productId, successUpdate, props.history]);

    const submitHandler = (event) => {
        event.preventDefault();
        dispatch(
            updateProduct({
                _id: productId, name, price, image, category, countInStock, brand, description
            })
        );
    };

    const[loadingUpload, setLoadingUpload] = useState(false);
    const [errorUpload, setErrorUpload] = useState("");

    const userSignin = useSelector( state => state.userSignin);
    const { userInfo } = userSignin;

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
            setImage(data);
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
                    <h1>Edit Product: {productId}</h1>
                </div>
                { loadingUpdate && <LoadingBox></LoadingBox> }
                { errorUpdate && <MessageBox>{errorUpdate}</MessageBox> }

                { 
                    loading ? <LoadingBox></LoadingBox>
                    :
                    error ? <MessageBox variant="danger">{error}</MessageBox>
                    :
                    <>
                        <div>
                            <label htmlFor="name">Name</label>
                            <input 
                                id="name" 
                                type="text"
                                placeholder="Enter Name"
                                value={name}
                                onChange={event => setName(event.target.value)}
                            ></input>
                        </div>

                        <div>
                            <label htmlFor="price">Price</label>
                            <input 
                                id="price" 
                                type="text"
                                placeholder="Enter Price"
                                value={price}
                                onChange={event => setPrice(event.target.value)}
                            ></input>
                        </div>

                        <div>
                            <label htmlFor="image">Image</label>
                            <input 
                                id="image" 
                                type="text"
                                placeholder="Enter Image"
                                value={image}
                                onChange={event => setImage(event.target.value)}
                            ></input>
                        </div>

                        <div>
                            <label htmlFor="imageFile">Image File</label>
                            <input
                                type="file"
                                id="imageFile"
                                label="Choose Image"
                                onChange={uploadFileHandler}
                            ></input>
                            { loadingUpload && <LoadingBox></LoadingBox>}
                            { errorUpload && <MessageBox variant="danger">{errorUpload}</MessageBox>}
                        </div>

                        <div>
                            <label htmlFor="category">Category</label>
                            <input 
                                id="category" 
                                type="text"
                                placeholder="Enter Category"
                                value={category}
                                onChange={event => setCategory(event.target.value)}
                            ></input>
                        </div>

                        <div>
                            <label htmlFor="countInStock">Count In Stock</label>
                            <input 
                                id="countInStock" 
                                type="text"
                                placeholder="Enter Count In Stock"
                                value={countInStock}
                                onChange={event => setCountInStock(event.target.value)}
                            ></input>
                        </div>

                        <div>
                            <label htmlFor="brand">Brand</label>
                            <input 
                                id="brand" 
                                type="text"
                                placeholder="Enter Brand"
                                value={brand}
                                onChange={event => setBrand(event.target.value)}
                            ></input>
                        </div>

                        <div>
                            <label htmlFor="name">Description</label>
                            <textarea 
                                id="description" 
                                type="text"
                                rows="3"
                                placeholder="Enter Description"
                                value={description}
                                onChange={event => setDescription(event.target.value)}
                            ></textarea>
                        </div>

                        <div>
                            <label></label>
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