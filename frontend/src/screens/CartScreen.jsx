import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, ListGroup, Image, Button, Card } from "react-bootstrap";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa"; // Import Plus and Minus icons
import Title from "../components/Title";

import { addToCart, removeFromCart } from "../slices/cartSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBangladeshiTakaSign } from "@fortawesome/free-solid-svg-icons";

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const increaseQty = (item) => {
    if (item.qty < item.countInStock) {
      addToCartHandler(item, item.qty + 1);
    }
  };

  const decreaseQty = (item) => {
    if (item.qty > 1) {
      addToCartHandler(item, item.qty - 1);
    }
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <Row>
      <Col md={8}>
        <Title>Shopping Cart</Title>
        {cartItems.length === 0 ? (
          <div>
            Your cart is empty <Link to="/">Go Back</Link>
          </div>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row>
                  <Col md={2}>
                    <Image
                      src={`http://localhost:5000${
                        item.image.startsWith("/") ? "" : "/"
                      }${item.image.replace(/\\/g, "/")}`}
                      alt={item.name}
                      fluid
                      rounded
                      onError={(e) => {
                        console.error("Image failed to load:", item.image);
                        e.target.src = "https://via.placeholder.com/100";
                        e.target.alt = "Image not found";
                      }}
                    />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>
                    <FontAwesomeIcon icon={faBangladeshiTakaSign} /> {""}
                    {item.price}
                  </Col>
                  <Col md={3}>
                    <div className="d-flex align-items-center">
                      <Button
                        variant="light"
                        onClick={() => decreaseQty(item)}
                        disabled={item.qty === 1}
                      >
                        <FaMinus />
                      </Button>
                      <span className="mx-2">{item.qty}</span>
                      <Button
                        variant="light"
                        onClick={() => increaseQty(item)}
                        disabled={item.qty === item.countInStock}
                      >
                        <FaPlus />
                      </Button>
                    </div>
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4} className="mt-4">
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                items
              </h2>
              <FontAwesomeIcon icon={faBangladeshiTakaSign} /> {""}
              {Math.round(
                cartItems.reduce((acc, item) => acc + item.qty * item.price, 0)
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cartItems.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
