import { Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { Link } from 'react-router-dom';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Title from '../components/Title'


const HomeScreen = () => {
  const { pageNumber, keyword } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
      <>
        {!keyword ? (
            <div className="mt-4" >

            <ProductCarousel />
            </div>
        ) : (
            <Link to='/' className='btn btn-light mb-4'>
              Go Back
            </Link>
        )}
        {isLoading ? (
            <Loader />
        ) : error ? (
            <Message variant='danger'>
              {error?.data?.message || error.error}
            </Message>
        ) : (
            <>
              <Title>Latest Products</Title>
              <Row>
                {data.products.map((product) => (
                    <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                      <Product product={product} />
                    </Col>
                ))}
              </Row>
              <Paginate
                  pages={data.pages}
                  page={data.page}
                  keyword={keyword ? keyword : ''}
              />
            </>
        )}
      </>
  );
};

export default HomeScreen;