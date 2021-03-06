import {
    applyMiddleware, 
    combineReducers, 
    compose, 
    createStore 
} from 'redux';

import { 
    productListReducer, 
    productDetailsReducer, 
    productCreateReducer, 
    productUpdateReducer, 
    productDeleteReducer, productCategoryListReducer, productCreateReviewReducer 
} from './reducers/productReducers';

import { 
    userDetailsReducer, 
    userListReducer, 
    userRegisterReducer, 
    userSigninReducer, 
    userUpdateProfileReducer,
    userDeleteReducer, 
    userUpdateReducer, 
    userTopSellerListReducer, userAddressMapReducer
} from './reducers/userReducers';

import { 
    orderCreateReducer, 
    orderDeatilsReducer, 
    orderDeleteReducer, 
    orderDeliverReducer, 
    orderListReducer, 
    orderMineListReducer, 
    orderPayReducer,
    orderSummaryReducer,
} from './reducers/orderReducers';

import thunk from 'redux-thunk';
import { cartReducer } from './reducers/cartReducers';

const initialState = {
    userSignin: {
        userInfo: localStorage.getItem("userInfo") 
        ? JSON.parse(localStorage.getItem("userInfo")) : null
    },
    cart: {
        // Converts the local storage "cartItems" to an array if it exist otherwise creates an empty array
        cartItems: localStorage.getItem("cartItems") 
        ? JSON.parse(localStorage.getItem("cartItems")) 
        : [],
        shippingAddress: localStorage.getItem("shippingAddress")
        ? JSON.parse(localStorage.getItem("shippingAddress"))
        : {},
        paymentMethod: "PayPal",
    }
};

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userSignin: userSigninReducer,
    userRegister: userRegisterReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDeatilsReducer,
    orderPay: orderPayReducer,
    orderMineList: orderMineListReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userUpdate: userUpdateReducer,
    productCreate: productCreateReducer,
    productUpdate: productUpdateReducer,
    productDelete: productDeleteReducer,
    productCategoryList: productCategoryListReducer,
    productCreateReview: productCreateReviewReducer, 
    orderList: orderListReducer,
    orderDelete: orderDeleteReducer,
    orderDeliver: orderDeliverReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userTopSellersList: userTopSellerListReducer,
    userAddressMap: userAddressMapReducer,
    orderSummary: orderSummaryReducer
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    reducer, 
    initialState, 
    composeEnhancer(applyMiddleware(thunk))
);

export default store;