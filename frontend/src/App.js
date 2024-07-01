
import { Outlet } from 'react-router-dom'
import Header from './components/Header';
import Footer from "./components/Footer";


const App = () => {
    return (
        <>
            <Header />
            <main className='container mx-auto '>
                <div>
                    {/*<h1 className="container mx-auto ">Welcome to Tech city</h1>*/}
                    <Outlet/>
                </div>
            </main>
            <Footer/>
        </>
    );
};

export default App;