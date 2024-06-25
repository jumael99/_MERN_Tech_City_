import { useState } from 'react';
import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.png';
import { Link } from "react-router-dom";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className="bg-gray-900">
            <nav className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <img src={logo} alt="TechCity logo" className="h-8 w-8 mr-2" />
                            <span className="text-white text-lg font-bold">TechCity</span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/cart" className="text-white flex items-center">
                            <FaShoppingCart className="mr-1" /> Cart
                        </Link>
                        <Link to="/login" className="text-white flex items-center">
                            <FaUser className="mr-1" /> Sign In
                        </Link>
                    </div>
                    <div className="md:hidden">
                        <button
                            onClick={toggleNavbar}
                            className="text-white focus:outline-none"
                        >
                            {isOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>
                {isOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link to="/cart" className="text-white block py-2 rounded-md">
                                <FaShoppingCart className="inline mr-1" /> Cart
                            </Link>
                            <Link to="/login" className="text-white block py-2 rounded-md">
                                <FaUser className="inline mr-1" /> Sign In
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Header;