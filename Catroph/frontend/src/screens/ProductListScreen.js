import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { createProduct, deleteProduct, listProducts } from '../actions/productActions';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { PRODUCT_CREATE_RESET, PRODUCT_DELETE_RESET } from '../constants/productConstants';

export default function ProductListScreen(props) {
  const { pageNumber = 1 } = useParams();

  const sellerMode = props.match.path.indexOf('/seller') >= 0;
  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct
  } = productCreate;
  
  const productDelete = useSelector((state) => state.productDelete);
  const { 
    loading: loadingDelete, 
    error: errorDelete, 
    success: successDelete
  } = productDelete;

  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  const dispatch = useDispatch();

  useEffect(() => {
    if (successCreate) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      props.history.push(`/product/${createdProduct._id}/edit`);
    }

    if(successDelete)
      dispatch({ type: PRODUCT_DELETE_RESET });

    dispatch(listProducts({ seller: sellerMode ? userInfo._id : '', pageNumber }));
  }, [
    createdProduct, 
    dispatch, 
    props.history, 
    successCreate, 
    successDelete, 
    userInfo, 
    sellerMode,
    pageNumber
  ]);

  const deleteHandler = (product) => {
    if(window.confirm("Are you sure you want to delete this product?"))
      dispatch(deleteProduct(product._id));
  };

  const createHandler = () => {
    dispatch(createProduct());
  };

  return (
    <div>
      <div className="row">
        <h1>Products</h1>

        <button 
          type="button" 
          className="primary" 
          onClick={createHandler}
        >
          Create Product
        </button>
      </div>

      { loadingDelete && <LoadingBox></LoadingBox> }
      { errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox> }
      { successDelete && <MessageBox variant="success">Successfully Deleted</MessageBox> }

      { loadingCreate && <LoadingBox></LoadingBox> }
      { errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox> }
      { errorDelete && <MessageBox variant="success">Successfully Created</MessageBox> }
      {
        loading ? (<LoadingBox></LoadingBox>) 
        : error ? ( <MessageBox variant="danger">{error}</MessageBox>) 
        : (
          <>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>
                  <button
                    type="button"
                    className="small"
                    onClick={() =>
                      props.history.push(`/product/${product._id}/edit`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="small"
                    onClick={() => deleteHandler(product)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="row center pagination">
          {
              [...Array(pages).keys()].map((pageNum) => (
                  <Link 
                      className={ pageNum + 1 === page ? "active" : ""}
                      key={pageNum + 1}
                      to={`/productList/pageNumber/${pageNum + 1}`}
                  >   {pageNum + 1}   
                  </Link>
              ))
          }
        </div> 
        </>
      )}
    </div>
  );
}
