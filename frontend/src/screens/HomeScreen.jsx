import Product from "../components/Product"
import Loader from "../components/Loader";
import { Container, Row, Col } from 'react-bootstrap';
import { useGetProductsQuery } from "../slices/productsApiSlice";

const HomeScreen = () => {

    const { data: products, isLoading, error } = useGetProductsQuery(); /*productsState*/


    return (
        <>
            {isLoading ? (
                <Loader/>
            ) : error ? (
                <h2>{error?.data?.message || error.error }</h2>
            ) : (
                <>
                    <div className="my-4">
                        <h1 className="text-center text-3xl font-bold">Latest Products</h1>
                    </div>
                    <Row>
                        {products.map((product) => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                <Product product={product}/>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </>
    );
};

export default HomeScreen;