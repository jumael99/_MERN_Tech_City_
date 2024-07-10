<<<<<<< Updated upstream
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector } from 'react-redux';

const Header = () => {
    const { cartItems } = useSelector((state) => state.cart);
=======
import { useState } from 'react';
import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/logo.png';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
    const { cartItems } = useSelector((state) => state.cart);
    console.log(cartItems);

    const [isOpen, setIsOpen] = useState(false);
>>>>>>> Stashed changes

    console.log('Cart Items:', cartItems);

    return (
<<<<<<< Updated upstream
        <header>
            <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand>ProShop</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='ms-auto'>
                            <LinkContainer to='/cart'>
                                <Nav.Link>
                                    <FaShoppingCart /> Cart
                                    {cartItems.length > 0 && (
                                        <Badge pill bg='success' style={{ marginLeft: '5px' }}>
                                            {cartItems.reduce((a, c) => a + c.qty, 0)}
                                        </Badge>
                                    )}
                                </Nav.Link>
                            </LinkContainer>
                            <LinkContainer to='/login'>
                                <Nav.Link href='/login'>
                                    <FaUser /> Sign In
                                </Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
=======
        <header className="bg-gray-900">
            <nav className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div>
                        <Link to="/" className="flex items-center">
                            <img src={logo} alt="TechCity logo" className="h-8 w-8 mr-2" />
                            <span className="text-white text-lg font-bold">TechCity</span>
                        </Link>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                        <Link to="/cart" className="text-white flex items-center">
                            <FaShoppingCart className="mr-1" /> Cart
                            {cartItems.length > 0 && (
                                <span className="ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
    {cartItems.reduce((a, c) => a + (c.qty || 0), 0)}
  </span>
                            )}
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
                                {
                                    cartItems.length > 0 && (
                                        <span className="ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
                                            {cartItems.reduce((a, c) => a + c.qty, 0)}
                                        </span>
                                    )
                                }
                            </Link>
                            <Link to="/login" className="text-white block py-2 rounded-md">
                                <FaUser className="inline mr-1" /> Sign In
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
>>>>>>> Stashed changes
        </header>
    );
};

export default Header;
