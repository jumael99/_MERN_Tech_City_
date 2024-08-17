import React from "react";
import { Navbar, Nav, Container, NavDropdown, Badge } from "react-bootstrap";
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import SearchBox from "./SearchBox";
import "../assets/styles/header.css";

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header>
      <Navbar
        className="custom-navbar"
        variant="dark"
        expand="lg"
        collapseOnSelect
      >
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="brand-container">
            <img src={logo} alt="TechCity" className="brand-logo" />
            <span className="brand-name">TechCity</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <SearchBox className="search-box-container" />
            <Nav className="ms-auto nav-links">
              <Nav.Link as={Link} to="/cart" className="cart-link">
                <FaShoppingCart className="icon" />
                <span>Cart</span>
                {cartItems.length > 0 && (
                  <Badge pill bg="danger" className="cart-badge">
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </Badge>
                )}
              </Nav.Link>
              {userInfo ? (
                <>
                  <NavDropdown
                    title={userInfo.name}
                    id="username"
                    className="user-dropdown"
                  >
                    <NavDropdown.Item as={Link} to="/profile">
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                  {userInfo.isAdmin && (
                    <NavDropdown
                      title="Admin"
                      id="adminmenu"
                      className="admin-dropdown"
                    >
                      <NavDropdown.Item as={Link} to="/admin/productlist">
                        Products
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/orderlist">
                        Orders
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/admin/userlist">
                        Users
                      </NavDropdown.Item>
                    </NavDropdown>
                  )}
                  {userInfo.role === "seller" && (
                    <NavDropdown
                      title="Seller"
                      id="sellermenu"
                      className="seller-dropdown"
                    >
                      <NavDropdown.Item as={Link} to="/seller/productlist">
                        My Products
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/seller/product/create">
                        Create Product
                      </NavDropdown.Item>
                    </NavDropdown>
                  )}
                </>
              ) : (
                <Nav.Link as={Link} to="/login" className="signin-link">
                  <span>Sign In</span>
                  <FaUser className="icon" />
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
