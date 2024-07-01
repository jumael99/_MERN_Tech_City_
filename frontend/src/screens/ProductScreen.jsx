import { useEffect, useState } from "react";
import React from 'react';
import {Link, useParams} from "react-router-dom";
import product from '../components/Product'
import axios from 'axios';

/*here we need to show product details
* we've a product object need to show those objects elements*/
function ProductScreen(props) {
    const [product, setProduct] = useState({});

    const {id: productId} = useParams();

    /*If the product id changes we want this to run*/
    useEffect(() => {
        const fetchProduct = async () => {
            const { data } = await axios.get(`http://localhost:5000/api/products/${productId}`);
            setProduct(data);
        };
        fetchProduct();
    }, [productId]);


    if (!product) {
        return <div>Product not found</div>;
    }
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