import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import { listProductCategories } from './actions/productActions';
import { signout } from './actions/userActions';
import AdminRoute from './components/AdminRoute';
import LoadingBox from './components/LoadingBox';
import MessageBox from './components/MessageBox';
import PrivateRoute from './components/PrivateRoute';
import SearchBox from './components/SearchBox';
import SellerRoute from './components/SellerRoute';
import CartScreen from './screens/CartScreen';
import DashboardScreen from './screens/DashboardScreen';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import OrderListScreen from './screens/OrderListScreen';
import OrderScreen from './screens/OrderScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductScreen from './screens/ProductScreen';
import ProfileScreen from './screens/ProfileScreen';
import RegisterScreen from './screens/RegisterScreen';
import SearchScreen from './screens/SearchScreen';
import SellerScreen from './screens/SellerScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SigninScreen from './screens/SigninScreen';
import UserEditScreen from './screens/UserEditScreen';
import UserListScreen from './screens/UserListScreen';

function App(props) {

    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
    // Get Access to cartItems from redux store
    const cart = useSelector(state => state.cart);
    const { cartItems } = cart;

    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;

    const productCategoryList = useSelector((state) => state.productCategoryList);
    const { loading: loadingCategories, error: errorCategories, categories } = productCategoryList;

    const dispatch = useDispatch();

    const signoutHandler = () => {
        dispatch(signout());
    };

    useEffect(() => {
        dispatch(listProductCategories());
    }, [dispatch]);

  return (
    <BrowserRouter>
	<div className="grid-container">
        <header className="row">
            <div>
                <button
                    type="button"
                    className="open-sidebar"
                    onClick={ () => setSidebarIsOpen(true) }
                >
                    <i className="fa fa-bars"></i>
                </button>
                <Link 
                    className="brand" 
                    to="/">Catroph
                </Link>
            </div>

            <div>
                <Route 
                    render={ ({history}) => <SearchBox history={history}></SearchBox> }>    
                </Route>
            </div>
            <div>
                <Link to="/cart">
                    Cart
                    {
                        cartItems.length > 0 && (
                            <span className="badge">{cartItems.length}</span>
                        )
                    }
                </Link>
                {
                    userInfo ? (
                        <div className="dropdown">
                            <Link to="#">
                                {userInfo.name} <i className="fa fa-caret-down"></i>{" "}
                            </Link>

                            <ul className="dropdown-content">
                                <li>
                                    <Link to="/profile">
                                        User Profile
                                    </Link>
                                </li>

                                <li>
                                    <Link to="/orderhistory">
                                            Order History
                                    </Link>
                                </li>

                                <li>
                                    <Link 
                                        to="/" 
                                        onClick={signoutHandler}
                                    > Sign Out
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    ) :
                    (
                        <Link to="/signin">Sign In</Link>
                    )
                }
                {
                    userInfo && userInfo.isSeller && (
                        <div className="dropdown">
                            <Link 
                                to="#seller">
                                Seller <i className="fa fa-caret-down"></i>
                            </Link>
                            <ul className="dropdown-content">

                                <li>
                                    <Link to="/productList/seller">Products</Link>
                                </li>

                                <li>
                                    <Link to="/orderList/seller">Orders</Link>
                                </li>
                            </ul>
                        </div>
                    )
                }
                {
                    userInfo && userInfo.isAdmin && (
                        <div className="dropdown">
                            <Link 
                                to="#admin">
                                Admin <i className="fa fa-caret-down"></i>
                            </Link>
                            <ul className="dropdown-content">
                                <li>
                                    <Link to="/dashboard">Dashboard</Link>
                                </li>

                                <li>
                                    <Link to="/productList">Products</Link>
                                </li>

                                <li>
                                    <Link to="/orderList">Orders</Link>
                                </li>

                                <li>
                                    <Link to="/userList">Users</Link>
                                </li>
                            </ul>
                        </div>
                    )
                }
            </div>
        </header>

        <aside className={sidebarIsOpen ? "open" : ""}>
            <ul className="categories">
                <li>
                    <strong>Categories</strong>
                    <button 
                        className="close-sidebar"
                        type="button"
                        onClick={ () => setSidebarIsOpen(false) }
                    >
                        <i className="fa fa-close"></i>
                    </button>
                </li>

                {
                    loadingCategories ? <LoadingBox></LoadingBox>
                    :
                    errorCategories ? <MessageBox variant="danger">{errorCategories}</MessageBox>
                    :
                    <> {     
                        categories.map( (c) => (
                            <li key={c}>
                                <Link 
                                    to={`/search/category/${c}`}
                                    onClick={ () => setSidebarIsOpen(false) }
                                >{c}
                                </Link>
                            </li>
                        ))
                    }
     
                    </>
                }

            </ul>
        </aside>

        <main>
            <Route path="/seller/:id" component={SellerScreen}></Route>
            <Route path="/cart/:id?" component={CartScreen}></Route>
            <Route path="/product/:id" component={ProductScreen} exact></Route>
            <Route path="/product/:id/edit" component={ProductEditScreen} exact></Route>
            <Route path="/signin" component={SigninScreen}></Route>
            <Route path="/register" component={RegisterScreen}></Route>
            <Route path="/shipping" component={ShippingAddressScreen}></Route>
            <Route path="/payment" component={PaymentMethodScreen}></Route>
            <Route path="/placeorder" component={PlaceOrderScreen}></Route>
            <Route path="/order/:id" component={OrderScreen}></Route>
            <Route path="/orderhistory" component={OrderHistoryScreen}></Route>
            <PrivateRoute path="/profile" component={ProfileScreen}></PrivateRoute>
            <PrivateRoute path="/map" component={MapScreen}></PrivateRoute>
            <AdminRoute path="/productList" component={ProductListScreen} exact></AdminRoute>
            <AdminRoute path="/orderList" component={OrderListScreen} exact></AdminRoute>
            <AdminRoute path="/userList" component={UserListScreen}></AdminRoute>
            <AdminRoute path="/user/:id/edit" component={UserEditScreen}></AdminRoute>
            <AdminRoute path="/dashboard" component={DashboardScreen}></AdminRoute> 
            <SellerRoute path="/productList/seller" component={ProductListScreen}></SellerRoute>
            <SellerRoute path="/orderList/seller" component={OrderListScreen}></SellerRoute>
            <Route path="/" component={HomeScreen} exact></Route>
            <Route path="/search/name/:name?" component={SearchScreen} exact></Route>
            <Route path="/search/category/:category" component={SearchScreen} exact></Route>
            <Route path="/search/category/:category/name/:name" component={SearchScreen} exact></Route>
            <Route path="/search/category/:category/name/:name/min/:min/max/:max/rating/:rating/order/:order/pageNumber/:pageNumber" component={SearchScreen} exact></Route>
        </main>

        <footer className="row center">
            <p>&copy; copyright 2021 Catroph</p>
        </footer>
    </div>
    </BrowserRouter>
  );
}

export default App;
