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
import PaymentScreen from './screens/PaymentScreen'
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import ProfileScreen from "./screens/ProfileScreen"
import OrderListScreen from "./screens/admin/OrderListScreen";
import ProductListScreen from "./screens/admin/ProductListScreen";
import ProductEditScreen from "./screens/admin/ProductEditScreen";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={ <App/> }>
            <Route path="/" element={ <HomeScreen /> }></Route>
            <Route path="/product/:id" element={ <ProductScreen/> } />
            <Route path='/cart' element={ <CartScreen/> }></Route>
            <Route path='/login' element={ <LoginScreen/> }></Route>
            <Route path='/register' element={ <RegisterScreen/> }></Route>

            {/* Private Routes */}
            <Route path='' element={ <PrivateRoute/> }>
                <Route path='/shipping' element ={ <ShippingScreen/> }> </Route>
                <Route path='/payment' element={ < PaymentScreen /> } ></Route>
                <Route path='/placeorder' element={ < PlaceOrderScreen /> } ></Route>
                <Route path='/order/:id' element={ < OrderScreen /> } ></Route>
                <Route path='/profile' element={ < ProfileScreen /> } ></Route>
            </Route>

            {/* Admin Routes */}
            <Route path='' element={ <AdminRoute/> }>
                <Route path='/admin/orderlist' element ={ <OrderListScreen/> }> </Route>
                <Route path='/admin/productlist' element ={ <ProductListScreen/> }> </Route>
                <Route path='/admin/product/:id/edit' element ={ <ProductEditScreen/> }> </Route>
            </Route>
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

