import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();

  return isLoading ? (
      <Loader />
  ) : error ? (
      <Message variant="danger">{error?.data?.message || error.error}</Message>
  ) : (
      <Carousel pause="hover" className="bg-primary my-4">
        {products.map((product) => {
          // Construct the image URL
          const imageUrl = `http://localhost:5000${product.image}`;

          return (
              <Carousel.Item key={product._id}>
                <Link to={`/product/${product._id}`}>
                  <Image
                      src={imageUrl}
                      alt={product.name}
                      fluid
                      onError={(e) => {
                        console.error('Image failed to load:', imageUrl);
                        e.target.src = 'https://via.placeholder.com/400';
                        e.target.alt = 'Image not found';
                      }}
                  />
                  <Carousel.Caption className="carousel-caption">
                    <h2 className="text-white text-right">
                      {product.name} (${product.price})
                    </h2>
                  </Carousel.Caption>
                </Link>
              </Carousel.Item>
          );
        })}
      </Carousel>
  );
};

export default ProductCarousel;
