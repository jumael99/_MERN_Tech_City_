import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider
} from 'react-router-dom'
import './assets/styles/bootstrap.custom.css'; //bootstrap css
import './assets/styles/index.css'; /*custom css file*/
import App from './App';
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ShippingScreen from './screens/ShippingScreen';
import store from "./store";
import {Provider} from "react-redux";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={ <App/> }>
            <Route path="/" element={ <HomeScreen /> }></Route>
            <Route path="/product/:id" element={ <ProductScreen/> } />
            <Route path='/cart' element={ <CartScreen/> }></Route>
            <Route path='/login' element={ <LoginScreen/> }></Route>
            <Route path='/register' element={ <RegisterScreen/> }></Route>
            <Route path='/shipping' element ={ <ShippingScreen/> }> </Route>
        </Route>
    )
)


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
        <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>
);

