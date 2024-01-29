import React, { Fragment, useRef, useState, useEffect } from "react";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { Link } from "react-router-dom";
import "./LoginSignUp.css";
import FaceIcon from "@material-ui/icons/Face";

import { useDispatch, useSelector } from "react-redux";
import { clearErrors, login } from "../../actions/userAction";
import { useAlert } from "react-alert";
import Loader from "../layout/loader/loader";
const LoginSignUp = () => {

  const dispatch = useDispatch()
  const alert = useAlert()

  const {error,loading,isAuthenticated}  = useSelector(state => state.user)
  //useRef is used here to create reference of other elements and manipulate them . Like here switcherTab is a reference of button element . This reference is used to add class to the button element. Here onclick event of the above P tags is used to change the position of this button. Adding a class and removing a class is used to changed the position of button element , with the help of css.
  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");


  

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;

  const [avatar, setAvatar] = useState();
  const [avatarPreview,setAvatarPreview] = useState("/Profile.png")

  //This functiin is invoked whenever there is a change in any input field in the registration form.
  const registerDataChange = (e) =>{
    if(e.target.name==="avatar")
    {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    }
    else{
      setUser({...user,[e.target.name] : e.target.value})
    }
  }

  useEffect(() => {
    
  
   if(error){
    alert.error(error);
    dispatch(clearErrors())
   }
  }, [dispatch,alert,error])
  

  

  const switchTabs = (e, tab) => {
    if (tab === "login") {

      
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      //loginTab is an reference to login form, if login is clicked shifttoLeft class is removed and  x becomes 0
      //register tab is shifted from the position . For details look at css file

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    } else if (tab === "register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  const loginSubmit = (e) => {
    e.preventDefault()
    dispatch(login(loginEmail,loginPassword))
    console.log("Form Submitted");
  };

  //this function is used to update the state variables on successful submission
  const registerSubmit = (e) =>{
    //Prevent default form submission
    e.preventDefault()

    const myForm = new FormData()

    myForm.set("name",name)
    myForm.set("email",email)
    myForm.set("password",password)
    myForm.set("avatar",avatar)
    console.log("Sign Up Form Submitted")
  }

  
  return (
    <Fragment>
      {
        loading? (<Loader />) : (<div className="LoginSignUpContainer">
        <div className="LoginSignUpBox">
          <div>
            <div className="login_signUp_toggle">
              <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
              <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
            </div>
            <button ref={switcherTab}></button>
          </div>
          <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
            <div className="loginEmail">
              <MailOutlineIcon />
              <input
                type="email"
                placeholder="Email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="loginPassword">
              <LockOpenIcon />
              <input
                type="password"
                placeholder="Password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <Link to="/password/forgot">Forget Password ?</Link>
            <input type="submit" value="Login" className="loginBtn"/>
             
          </form>
          <form
                className="signUpForm"
                ref={registerTab}
                encType="multipart/form-data"
                onSubmit={registerSubmit}
              >
                <div className="signUpName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    name="name"
                    value={name}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    value={email}
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signUpPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    name="password"
                    value={password}
                    onChange={registerDataChange}
                  />
                </div>

                <div id="registerImage">
                  <img src={avatarPreview} alt="Avatar Preview" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"/*any kind of image */
                    onChange={registerDataChange}
                  />
                </div>
                <input type="submit" value="Register" className="signUpBtn" />
              </form>
        </div>
      </div>)
      }
    </Fragment>
  );
};

export default LoginSignUp;
