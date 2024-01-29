import axios from "axios";

import {
  ALL_PRODUCT_REQUEST,
  ALL_PRODUCT_FAIL,
  ALL_PRODUCT_SUCCESS,
  CLEAR_ERRORS,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_SUCCESS
} from "../constants/productConstant";

//The purpose of this nested structure (both the functions below)is to create an action creator that, when called, returns an asynchronous function (a thunk) that can perform some asynchronous actions and then dispatch an action to update the Redux store.
export const getProduct = (keyword="",currentPage = 1,price= [0,5000],category,rating=0)=>async(dispatch) =>{
    try {

        dispatch({type: ALL_PRODUCT_REQUEST})
        
        let Link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${rating}`
        if(category)
        {
            Link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&category=${category}&ratings[gte]=${rating}`
        }
        
    

       
        const {data} = await axios.get(Link)  // this means only fetching the data from the response object
        console.log(data)

        dispatch({
            type: ALL_PRODUCT_SUCCESS,
            payload: data
        })
        
    } catch (error) {
        dispatch({
            type: ALL_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
}

//clearing errors

export const clearErrors = () => async(dispatch) =>{
    dispatch({type: CLEAR_ERRORS})
}


export const getProductDetails = (id)=>async(dispatch) =>{
    try {

        dispatch({type: PRODUCT_DETAILS_REQUEST})

        

        const {data} = await axios.get(`/api/v1/product/${id}`) // this means only fetching the data from the response object

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data.product
        })
        
    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAIL,
            payload: error.response.data.message
        })
    }
}