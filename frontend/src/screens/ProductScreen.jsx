import React from 'react';
import {Link, useParams} from "react-router-dom";
import products from "../products";


function ProductScreen(props) {
    const {id: productId } = useParams();
    const product = products.find((p) => p._id === productId);
    return (
        <>
            <Link to="/">
                Go back
            </Link>
            <img src={product.image} alt={product.name} className="h-[100px]"/>
            <h3> {product.name}</h3>
            <div>rating: {product.rating}</div>
            <div>review: {product.numReviews}</div>
            <div>Price: {product.price}</div>
        </>
    );
}

export default ProductScreen;