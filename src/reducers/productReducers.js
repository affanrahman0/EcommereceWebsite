//These constants are used to identify the actions that this reducer should respond to
import {
  ALL_PRODUCT_REQUEST,
  ALL_PRODUCT_FAIL,
  ALL_PRODUCT_SUCCESS,
  CLEAR_ERRORS,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_SUCCESS


} from "../constants/productConstant";
//reducers are automatically called during state changes

//function below are defined with two parameters: state (the current state) and action (the action that was dispatched).
//when a new state needs to be generated in a reducer, it's essential to ensure that you don't lose any data that already exists in the state. Instead, you want to create a new state object that includes both the changes you want to make and retains the existing properties. This is often done using the spread operator (...state) to make a shallow copy of the existing state.
//However, in some cases, you may not need to spread the entire state if the action you're handling only affects a specific part of the state and you don't want to modify other parts of the state

//to update state dispatch function is used.
//the first argument indicates that the initial state will be an empty array  of products
export const productReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    //This indicates that a product request is in progress.
    case ALL_PRODUCT_REQUEST:
      return {
        loading: true,
        products: [],
      };
    case ALL_PRODUCT_SUCCESS:
      console.log(action.payload)
      return {
        loading: false,
        products: action.payload.products,
        ProductsCount: action.payload.ProductCount,
        resultPerPage : action.payload.ResultsPerPage,
        filteredProductsCount : action.payload.filteredProductsCount

      };
    case ALL_PRODUCT_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
        return{
            //shallow copy
            ...state,
            error: null
        }  
    default:
      return state;
  }
};

//the first argument indicates that the initial state is product and its an empty object
export const productDetailsReducer = (state = { product: {} }, action) => {
  switch (action.type) {
    //This indicates that a product request is in progress.
    case PRODUCT_DETAILS_REQUEST:
      return {
        loading: true,
        ...state,
      };
    case PRODUCT_DETAILS_SUCCESS:
      return {
        loading: false,
        product: action.payload,
      };
    case PRODUCT_DETAILS_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    case CLEAR_ERRORS:
        return{
            //shallow copy
            ...state,
            error: null
        }  
    default:
      return state;
  }
};
