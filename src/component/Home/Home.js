import React, { Fragment, useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import ProductCard from "./ProductCard.js";
import MetaData from "../layout/metadata";
import { getProduct } from "../../actions/productAction";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/loader/loader"
import { useAlert } from "react-alert";

// const product = {
//   name: "Blue shirt",
//   images: [
//     {
//       url: "https://img.freepik.com/free-psd/isolated-regular-plain-black-tshirt_125540-2942.jpg?w=360",
//     },
//   ],
//   price: "3000",
//   _id: "hhh",
// };
const Home = () => {
  const alert = useAlert()
  const dispatch = useDispatch(); //used to dispatch an action

 //useSelector is a hook provided by the react-redux library that allows you to select and extract data from the Redux store in a functional component. It takes a function as an argument.
 //useSelector is called during the first rendering. but dispatch function may update the redux store, which triggers subsequent rendering. And at every rendering useSelector function is called to update the data 
  const { loading, error, products } = useSelector(
    (state) => state.products
  );

  //useEffect handles side effects, (here data fetching, when the Home component is mounted)

  //here second argument is an optional array of dependencies. It determines when the effect should run. If the array is empty, the effect runs only after the initial render. If the array contains values, the effect will run when any of those dependencies(dispatch ,error etc) change.
  useEffect(() => {
    if(error){
      return alert.error(error)
    }
    dispatch(getProduct());
  }, [dispatch,error,alert]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          {/* <metadata title = ""/> */}
          <MetaData title="Home" />
          <div className="banner">
            <p>Welcome to Ecommerce</p>
            <h1>Find amazing Products Below</h1>
            {/* href attribute set to #container. This indicates that clicking on this link should navigate to an element with the id attribute set to "container" on the same page. */}
            <a href="#container">
              <button>
                Scroll <CgMouse />
              </button>
            </a>
          </div>

          <h2 className="homeHeading">Featured Products</h2>

          <div className="container" id="container">
            {/* If products is truthy, it means that it's an array, and the map function is called on it. The map   function is used to iterate over each element of the products array.
            Then each 'product' object is passed as prop to the functional component Product */}
            {products &&
              products.map((product) => {
                return <ProductCard key={product._id} product={product}  />;
              })}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Home;
