import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import {Provider} from 'react-redux'
import store from './store'

//react-alert handles and display alert messages in your React application
// react-alert provides you with an AlertProvider component and various options for alert customization. In your code, you import positions and transitions for configuring alert positions and animations, and AlertTemplate to define the appearance of the alert messages.
import {positions,transitions,Provider as AlertProvider} from 'react-alert'
import  AlertTemplate from 'react-alert-template-basic'

const Options = {
  timeout : 5000,
  positions : positions.BOTTOM_CENTER,
  transitions : transitions.SCALE
}


//When the ReactDOM.render() function is called, the App component is rendered inside the designated HTML element with the id of 'root'. This effectively injects your entire React application into the DOM, starting from the root component (App) and rendering all child components as well.
ReactDOM.render(
  //<Provider> component allows all components in your application to access the Redux store through React's context API.
  <Provider store={store}> 
  {/* entire application wrapped within the AlertProvider.You can now use the useAlert hook provided by react-alert within your React components to show alerts. For example, you use it in your Home component to display error messages:  */}
    <AlertProvider template = {AlertTemplate} {...Options}>
      <App />
    </AlertProvider>
  </Provider>,
  document.getElementById('root')
);



