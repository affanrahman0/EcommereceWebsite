import React from "react";
import { Link } from "react-router-dom"; //This component is used to create links for client-side routing within your React application.
import { Rating } from "@material-ui/lab";


//Product is a functional component that receives a product object as a prop.
//"props" is a short form for "properties," and it refers to a mechanism for passing data from one component to another. 
const ProductCard = ({ product }) => {
  const options = {
    edit: 'false',
    value: product.ratings,
    readOnly: true,
    precision: 0.5
  };
  return (
    //The 'to' prop of the Link component is set to product._id, which suggests that clicking on this card will navigate to a detailed view of the product with the specified ID.
    <Link className="productCard" to={`/product/${product._id}`}> 
      {/* if product.images[0] is undefined and if attempt is made to read it dirrectly, error will be thrown. so we are providing it with a default url  , although the default url is also not declared but in this case it'll go for alt*/}
      <img src={product.images[0]?.url || 'default-image-url'} alt={product.name} />
      
      <p>{product.name}</p>
      <div>
        <Rating {...options} />
        <span className="productCardSpan" >{`Reviews ${product.numOfreviews}`}</span>
      </div>
      <span>{`₹${product.price}`}</span>
    </Link>
  );
};

export default ProductCard;
