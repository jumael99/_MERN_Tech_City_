import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header';
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";


const App = () => {
    return (
        <>
            <Header />
            <main className='container mx-auto '>
                <Container>
                    <Outlet/>
                </Container>
            </main>
            <CartDrawer />
            <Footer/>
            <ToastContainer/>
        </>
    );
};

export default App;
