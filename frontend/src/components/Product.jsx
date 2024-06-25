import React from 'react';
import {Link} from "react-router-dom";

const Product = ({ product }) => {
    return (
        <div className="my-3 p-3 rounded-lg shadow-md bg-white">
            <Link to={`/product/${product._id}`}>
                <img src={product.image} alt={product.name} className="w-full h-auto rounded-t-lg" />
            </Link>

            <div className="p-4">
                <Link to={`/product/${product._id}`}>
                    <h2 className="text-xl font-bold mb-2">{product.name}</h2>
                </Link>

                <p className="text-2xl font-semibold text-gray-800">${product.price}</p>
            </div>
        </div>
    );
};

export default Product;