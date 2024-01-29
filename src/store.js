import {
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore,
} from "redux";

//This is a middleware library for Redux that allows you to write asynchronous actions in a more convenient way.
import thunk from "redux-thunk";

//This function is used to enable Redux DevTools Extension in your Redux store. It enhances the debugging capabilities of Redux by providing a visual representation
import { composeWithDevTools } from "redux-devtools-extension";
import { productDetailsReducer, productReducer } from "./reducers/productReducers";
import { userReducer } from "./reducers/userReducer";



//This function is used to combine multiple reducers into a single root reducer.Reducers are responsible for handling the state changes in your application.
//reducers are automattically called during state change
const reducer = combineReducers({
  products: productReducer,
  productDetails : productDetailsReducer,
  user : userReducer
});


//It initializes the initial state of the application.
let initialState = {};


const middleware = [thunk];

//The Redux store is created
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
