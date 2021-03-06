import { 
    CART_ADD_ITEM, 
    CART_EMPTY, 
    CART_REMOVE_ITEM, 
    CART_SAVE_PAYMENT_METHOD, 
    CART_SAVE_SHIPPING_ADDRESS 
} from '../constants/cartConstants';

export const cartReducer = ( state = { cartItems:[]}, action) => {
    switch(action.type) {
        case CART_ADD_ITEM:
            const item = action.payload;
            const existItem = state.cartItems.find(x => x.product === item.product);

            // Update a product in the shopping cart(cartItems)
            if(existItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map(x =>
                        x.product === existItem.product ? item : x),
                };
            }
            // Append the new item to the list of items in the shopping cart(cartItems)
            else {
                return {
                    ...state, cartItems: [...state.cartItems, item]
                };
            }

        case CART_REMOVE_ITEM:
            // Updates the shopping cart(cartItems) by removing the to-be deleted item
            return {
                ...state,
                cartItems: state.cartItems.filter(x => x.product !== action.payload)
            };

        case CART_SAVE_SHIPPING_ADDRESS:
            // Update the previous state by adding the Shipping Address info
            return { 
                ...state, 
                shippingAddress: action.payload 
            };

        case CART_SAVE_PAYMENT_METHOD:
            // Update the previous state by adding the Payment Method info
            return {
                ...state,
                paymentMethod: action.payload
            };
            // Updating the previos state by empting cartItems
        case CART_EMPTY:
            return { 
                ...state, 
                cartItems: [] 
            };
        default:
            return state;
    }
};