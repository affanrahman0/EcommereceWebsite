const Product = require("../models/productModels");
const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorHandlers");
const asyncErrors = require("../middleware/AsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

//create Product
// The main purpose of the asynchronous function is to interact with a database using the await keyword. The line const product = await Product.create(req.body); is awaiting the completion of the Product.create operation, which involves interacting with a database to create a new product entry.

//req.body contains the data sent by the client in the request's body, which is expected to match the structure of the product schema

//create product -- Admin
exports.createProduct = asyncErrors(async (req, res, next) => {
  req.body.user = req.user.id; //_id can be acessed as id express js does this for us
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

//get all products
exports.getAllProducts = asyncErrors(async (req, res, next) => {
  let ProductCount = await Product.countDocuments(); //no. of products
  let ResultsPerPage = 8; // no .of products to be displayed per page

   
  //In js functions uses pass by references
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;

  let filteredProductsCount = products.length;

  apiFeature.pagination(ResultsPerPage);

  products = await apiFeature.query.clone();

  res.status(200).json({
    success: true,
    products,
    ProductCount,
    ResultsPerPage,
    filteredProductsCount,
  });
});

//Get Product Details
exports.getProductDetails = asyncErrors(async (req, res, next) => {
  product = await Product.findById(req.params.id);

  if (product) {
    res.status(200).json({
      sucess: true,
      product,
    });
  } else {
    return next(new ErrorHandler("Product not found", 400));
  }
});

//Update products --Admin
exports.updateProduct = asyncErrors(async (req, res, next) => {
  // console.log(req.body)
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 500));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

//Delete products --Admin
exports.deleteProduct = asyncErrors(async (req, res, next) => {
  // Find and delete the product by its ID
  const deletedProduct = await Product.findByIdAndDelete(req.params.id);

  // If product is not found, return an error response
  if (!deletedProduct) {
    return next(new ErrorHandler("Product not found", 400));
  }

  // Send a success response indicating the product has been deleted
  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

exports.createProductReview = asyncErrors(async (req, res, next) => {
  const { rating, commentin, productId } = req.body; //this variable should exactlt match with the body that u are sending

  const review = {
    name: req.user.name,
    user: req.user._id,
    rating: Number(rating),
    Comment: commentin,
  };

  const product = await Product.findById(productId);

  //if the user has provided a riview previously
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user.id.toString()
  );

  //
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user.id.toString()) {
        rev.Comment = commentin; // updating the previous review
        rev.rating = rating;
      }
    });
  } else {
    product.reviews.push(review); // adding a new review
    product.numOfreviews = product.reviews.length;
  }

  let sum = 0;

  product.reviews.forEach((rev) => {
    sum += rev.rating;
  });

  product.ratings = sum / product.reviews.length; // avg rating of the product

  await product.save({ validateBeforeSave: false }); // you're allowing the data to be saved without being checked against the schema's validation rules that has been defined by you

  res.status(200).json({
    success: true,
    message: "Review added successfully",
    product,
  });
});

exports.getAllReviews = asyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) return next(new ErrorHandler("Product not found", 400));

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//delete a review by id
exports.deleteReview = asyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) return next(new ErrorHandler("Product not found", 400));

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() != req.query.id.toString()
  );

  let sum = 0;

  reviews.forEach((rev) => {
    sum += rev.rating;
  });

  let ratings = reviews.length == 0 ? 0 : sum / reviews.length;
  const numOfreviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfreviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "review deleted",
  });
});
