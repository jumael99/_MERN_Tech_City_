import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBangladeshiTakaSign } from "@fortawesome/free-solid-svg-icons";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let interval;

    if (products && products.length > 0) {
      interval = setInterval(() => {
        handleNext();
      }, 100000);
    }

    return () => clearInterval(interval);
  }, [activeIndex, products]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? products.length - 1 : prevIndex - 1,
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === products.length - 1 ? 0 : prevIndex + 1,
    );
  };

  return (
    <div className="relative w-full h-96 bg-gray-900 overflow-hidden">
      <div className="flex items-center justify-center h-full">
        {products &&
          products.map((product, index) => {
            let offset = index - activeIndex;
            if (offset < 0) offset += products.length;
            return (
              <div
                key={product._id}
                className={`absolute transition-all duration-300 ease-in-out ${
                  offset === 0
                    ? "w-64 h-80 z-20 opacity-100"
                    : offset === 1 || offset === products.length - 1
                      ? "w-48 h-64 z-10 opacity-60"
                      : "w-32 h-48 z-0 opacity-30"
                }`}
                style={{
                  transform: `translateX(${offset === 0 ? "0" : offset === 1 ? "70%" : offset === products.length - 1 ? "-70%" : "0"})`,
                }}
              >
                <Link to={`/product/${product._id}`}>
                  <img
                    src={`http://localhost:5000${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {offset === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 rounded-b-lg">
                      <h2 className="text-lg font-bold">{product.name}</h2>
                      <p>
                        <FontAwesomeIcon icon={faBangladeshiTakaSign} /> {""}
                        {product.price}
                      </p>
                    </div>
                  )}
                </Link>
              </div>
            );
          })}
      </div>
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
      >
        <ChevronRight size={32} />
      </button>
    </div>
  );
};

export default ProductCarousel;
