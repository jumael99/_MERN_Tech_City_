import Product from '../components/Product';
import products from '../products';

const HomeScreen = () => {
    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-8 mt-4">Latest Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <Product key={product._id} product={product}/>
                ))}
            </div>
        </div>
    );
};

export default HomeScreen;