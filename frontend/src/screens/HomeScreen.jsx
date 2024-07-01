import { useState, useEffect} from "react";
import Product from "../components/Product"
import axios from "axios";

const HomeScreen = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/products');
                setProducts(data);
            } catch (error) {
                setError(error);
                console.error('Error fetching products:', error);
            }
        };

        fetchProduct();
    }, []);

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