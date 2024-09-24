import React from "react";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBangladeshiTakaSign,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import "../assets/styles/product.css";

const Product = ({ product }) => {
  const imageUrl = `https://mern-tech-city.onrender.com${product.image.startsWith("/") ? "" : "/"}${product.image.replace(/\\/g, "/")}`;

  return (
    <div className="product-card my-3 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="relative">
        <Link to={`/product/${product._id}`}>
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              console.error("Image failed to load:", imageUrl);
              e.target.src = "https://via.placeholder.com/400";
              e.target.alt = "Image not found";
            }}
          />
        </Link>
        <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-600 to-indigo-600 text-white px-3 py-1 rounded-bl-lg">
          <FontAwesomeIcon icon={faBangladeshiTakaSign} className="mr-1" />
          {product.price}
        </div>
      </div>

      <div className="p-4 bg-gray-900 text-white">
        <Link to={`/product/${product._id}`}>
          <h2 className="text-xl font-bold mb-2 hover:text-purple-400 transition-colors duration-200">
            {product.name}
          </h2>
        </Link>

        <div className="flex justify-between items-center mb-3">
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </div>
      </div>
    </div>
  );
};

export default Product;
