import './App.css';
import Header from "./component/layout/Header/Header.js"
import Footer from "./component/layout/Footer/Footer.js"
import {BrowserRouter as Router, Route} from "react-router-dom"
import WebFont from "webfontloader"
import React from 'react';
import Home from "./component/Home/Home.js"
import Products from "./component/Product/Products.js"
import productDetails from "./component/Product/productDetails.js"
import Search from "./component/Product/Search.js"
import LoginSignUp from './component/User/LoginSignUp.js';




function App() {
  //It loads the specified fonts from Google Fonts using the WebFont library 
  React.useEffect(()=>{
    WebFont.load({
      google:{
        families : ["Roboto", "Chilanka"]
      }
    })
  },[])

  return (
    //<Router>: This is a component from the react-router-dom library that provides routing capabilities to your application. It wraps the rest of your components and enables you to create routes.
    <Router>
      
      <Header />
      {/* when the URL matches exactly '/', the Home component will be rendered */}
      <Route exact path="/" component={Home} />
      <Route exact path="/products" component={Products} />
      <Route exact path="/product/:id" component={productDetails} />
      <Route exact path="/products/:keyword" component={Products} />
      <Route exact path="/search" component={Search} />
      <Route exact path="/login" component={LoginSignUp} />
      
      <Footer />
    </Router>
  );
}

export default App;
