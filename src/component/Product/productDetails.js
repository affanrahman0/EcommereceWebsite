import React, { Fragment, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProductDetails } from "../../actions/productAction";
import "./productDetails.css";
import { Rating } from "@material-ui/lab";
//import { red } from "@material-ui/core/colors";
import ReviewCard from "./ReviewCard";
import Loader from "../layout/loader/loader";
import { useAlert } from "react-alert";
import MetaData from "../layout/metadata";

// In React Router, when a component is rendered by a Route component, React Router automatically injects certain props into that component. One of these automatically injected props is match. This is why, even though you don't explicitly pass any props when calling the component, the match prop is available inside the component.

//app.js is calling productDetails func through a route component without passing match as a parameter
const ProductDetails = ({ match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProductDetails(match.params.id));
  }, [dispatch, match.params.id, error, alert]);

  const options = {
    size: "large",
    value: product.ratings || 0,
    readOnly: true,
    precision: 0.5,
  };
  // carousel is used to create  slides for displaying a set of items (here product images).
  //item is each image in images array and i denotes their corresponding indexes
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={`${product.name} --Ecommerce`} />
          
          <div className="productDetails">
            <div>
              <Carousel>
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="carouselImage"
                      key={item.url}
                      src={item.url}
                      alt={`${i} slide`}
                    />
                  ))}
              </Carousel>
            </div>

            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product #{product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <Rating {...options} />
                <span>({product.numOfreviews} Reviews)</span>
              </div>
              <div className="detailsBlock-3">
                <h1> {`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button>-</button>
                    <input defaultValue="1" type="number" />
                    <button>+</button>
                  </div>
                  <button>Add to Cart</button>
                </div>

                <p>
                  sttus:{" "}
                  <b className={product.stocks < 1 ? "redColor" : "greenColor"}>
                    {product.stocks < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>
              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>
              <button className="SubmitReview"> Submit Review</button>
            </div>
          </div>

          <h3 className="reviewsHeading"> Reviews </h3>
          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => <ReviewCard review={review} />)}
            </div>
          ) : (
            <p className="noReviews"> No Reviews Yet</p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
