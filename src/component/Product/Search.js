import React, { Fragment, useState } from 'react'
import "./search.css"
import MetaData from '../layout/metadata'

const Search = ({history}) => {
    // UseState returns an array where the first element is the current state value, and the second element is a function to update the state.
    //Initially keyword is initialized as an empty string, when u type a char, that is concatenated by setKeyword function
    const  [keyword, setKeyword] = useState("")
    

    // In Js event handling, when an event occurs (such as a form submission in this case), an event object is automatically created by the browser and passed as an argument to the event handler function.

    //Here, e is the event object representing the form submission event. The e.preventDefault() method is called to prevent the default  form submission.
    //checks if the keyword is not empty, and then uses history.push() to navigate to the appropriate route. If the keyword is empty, it navigates to the general products route (/products), and if there is a keyword, it navigates to the product search route (/products/:keyword).
    const searchSubmitHandler = (e) => {
        e.preventDefault();
        if(keyword.trim())
        {
            history.push(`/products/${keyword}`);
        }
        else{
            history.push("/products")
        }
    }
  return <Fragment>
    <MetaData title="Search --Ecommerce"/>
    {/* onsubmit is an event handler, it will call serachSubmitHandler function */}
    <form className='searchBox' onSubmit={searchSubmitHandler}>
        

    {/* onChange={(e) => setKeyword(e.target.value)}: This is an event handler. It specifies a function that will be called whenever the value of the input changes. In this case, it's an arrow function that takes the event (e) as a parameter. When the input value changes, e.target.value contains the new value of the input field. setKeyword(e.target.value) is then called to update the keyword state with the new value. */}
         
        <input type="text" placeholder="Search a product..." onChange={(e) => setKeyword(e.target.value)} />
       
        <input type='submit' value= "search"/>

    </form>
  </Fragment>
}

export default Search