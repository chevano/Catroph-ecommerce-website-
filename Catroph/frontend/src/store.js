import {
    applyMiddleware, 
    combineReducers, 
    compose, 
    createStore 
} from 'redux';

import { 
    productListReducer, 
    productDetailsReducer, 
} from './reducers/productReducers';

import thunk from 'redux-thunk';
import { cartReducer } from './reducers/cartReducers';
import { userRegisterReducer, userSigninReducer } from './reducers/userReducers';

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
    }
};

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userSignin: userSigninReducer,
    userRegister: userRegisterReducer,
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    reducer, 
    initialState, 
    composeEnhancer(applyMiddleware(thunk))
);

export default store;