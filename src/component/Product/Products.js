import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layout/loader/loader";
import ProductCard from "../Home/ProductCard";
import { clearErrors, getProduct } from "../../actions/productAction";
import { useEffect } from "react";
import "./product.css";
import Pagination from "react-js-pagination";
import Typography from "@material-ui/core/Typography";
import { Slider } from "@material-ui/core";
import { useAlert } from "react-alert";
import MetaData from "../layout/metadata";


const categories = ["Laptop", "Electronics", "Footwear"];
const Products = ({ match }) => {
  const dispatch = useDispatch();
  const alert = useAlert()

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 5000]);
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState(0);

  const {
    products,
    loading,
    error,
    ProductsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);
  // console.log(filteredProductsCount);
  // console.log(resultPerPage);

  // console.log(resultPerPage)

  const keyword = match.params.keyword;

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  const priceHandler = (e, newPrice) => {
    setPrice(newPrice);
  };

  useEffect(() => {
    if(error)
    {
      alert.error(error)
      dispatch(clearErrors())
    }
    dispatch(getProduct(keyword, currentPage, price, category, rating));
  }, [dispatch, keyword, currentPage, price, category, rating,alert,error]);

  let count = filteredProductsCount;
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Products --Ecommerce"/>
          <h2 className="productsHeading">Products</h2>
          <div className="products">
            {/* If products is truthy, it means that it's an array, and the map function is called on it. The map   function is used to iterate over each element of the products array.
            Then each 'product' object is passed as prop to the functional component Product */}
            {products &&
              products.map((product) => {
                return <ProductCard key={product._id} product={product} />;
              })}
          </div>

          <div className="filterBox">
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={5000}
            />
            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>
            <fieldset>
              <Typography component="legend">Ratings</Typography>
              <Slider
                value={rating}
                onChange={(e, newRating) => setRating(newRating)}
                aria-labelledby="continuous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
          </div>

          {resultPerPage < count && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage || 0}
                totalItemsCount={ProductsCount || 0}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;
