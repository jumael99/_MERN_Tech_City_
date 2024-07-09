import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider
} from 'react-router-dom'
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css'; /*custom css file*/
import App from './App';
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import store from "./store";
import {Provider} from "react-redux";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={ <App/> }>
            <Route path="/" element={ <HomeScreen /> }></Route>
            <Route path="/product/:id" element={ <ProductScreen/> } />
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

