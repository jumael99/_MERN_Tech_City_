import React from "react";
import { Navbar, Nav, Container, NavDropdown, Badge } from "react-bootstrap";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import SearchBox from "./SearchBox";
import "../assets/styles/index.css";

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

  // Debugging: Log userInfo to check its structure
  console.log("userInfo:", userInfo);

  return (
    <header>
      <Navbar
        className="royalblue-navbar"
        variant="dark"
        expand="lg"
        collapseOnSelect
      >
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img src={logo} alt="TechCity" className="h-12 me-2" />
            <span>TechCity</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <SearchBox className="mx-auto" />
            <Nav className="ms-auto">
              <Nav.Link
                as={Link}
                to="/cart"
                className="d-flex align-items-center"
              >
                <FaShoppingCart className="me-1" />
                Cart
                {cartItems.length > 0 && (
                  <Badge pill bg="danger" className="ms-1">
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </Badge>
                )}
              </Nav.Link>
              {userInfo ? (
                <>
                  <NavDropdown title={userInfo.name} id="username">
                    <NavDropdown.Item as={Link} to="/profile">
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                  {userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="adminmenu">
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
                    <NavDropdown title="Seller" id="sellermenu">
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
                <Nav.Link
                  as={Link}
                  to="/login"
                  className="d-flex align-items-center"
                >
                  Sign In
                  <FaUser className="ms-1" />
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
