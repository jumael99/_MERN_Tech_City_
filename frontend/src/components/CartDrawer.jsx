import React from "react";
import { Offcanvas, Button, Image, ListGroup, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import useCart from "../hooks/useCart";

const CartDrawer = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    cartTotal,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const handleCheckout = () => {
    closeCart();
    navigate("/shipping");
  };

  const Empty = (
    <div className="p-4 text-center">
      <p className="mb-3">Your cart is empty.</p>
      <Link to="/" onClick={closeCart} className="btn btn-outline-secondary">
        Continue Shopping
      </Link>
    </div>
  );

  const offcanvasStyle = {
    "--bs-offcanvas-width":
      typeof window !== "undefined" && window.innerWidth < 576
        ? "100vw"
        : "420px",
  };

  return (
    <Offcanvas show={isOpen} onHide={closeCart} placement="end" backdrop style={offcanvasStyle}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Cart</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="d-flex flex-column p-0">
        {cartItems.length === 0 ? (
          Empty
        ) : (
          <>
            <div className="flex-grow-1 overflow-auto">
              <ListGroup variant="flush">
                {cartItems.map((item) => {
                  const linePrice = Math.round((item.price || 0) * (item.qty || 0));
                  return (
                    <ListGroup.Item key={`${item._id}__${item.variantKey || ""}`}>
                      <Row className="align-items-center">
                        <Col xs={3}>
                          <Image
                            src={`http://localhost:8989${item.image?.startsWith("/") ? "" : "/"}${(item.image || "").replace(/\\/g, "/")}`}
                            alt={item.name}
                            fluid
                            rounded
                            onError={(e) => {
                              e.currentTarget.src = "https://via.placeholder.com/80";
                            }}
                          />
                        </Col>
                        <Col xs={5}>
                          <div className="fw-semibold small mb-1">{item.name}</div>
                          {item.variantLabel && (
                            <div className="text-muted small">{item.variantLabel}</div>
                          )}
                          {!item.variantLabel && item.variantKey && (
                            <div className="text-muted small">{item.variantKey}</div>
                          )}
                          <div className="d-flex align-items-center mt-2">
                            <Button
                              size="sm"
                              variant="light"
                              onClick={() => updateQuantity(item, Math.max(1, (item.qty || 1) - 1))}
                              disabled={(item.qty || 1) <= 1}
                            >
                              <FaMinus />
                            </Button>
                            <span className="mx-2">{item.qty}</span>
                            <Button
                              size="sm"
                              variant="light"
                              onClick={() => updateQuantity(item, (item.qty || 1) + 1)}
                              disabled={item.countInStock && item.qty >= item.countInStock}
                            >
                              <FaPlus />
                            </Button>
                          </div>
                        </Col>
                        <Col xs={3} className="text-end">
                          <div className="small">৳ {linePrice}</div>
                          <Button
                            variant="light"
                            size="sm"
                            className="mt-2"
                            onClick={() => removeFromCart({ _id: item._id, variantKey: item.variantKey })}
                          >
                            <FaTrash />
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </div>

            <div className="border-top p-3">
              <div className="d-flex justify-content-between mb-3">
                <span className="fw-semibold">Subtotal</span>
                <span className="fw-bold">৳ {Math.round(cartTotal)}</span>
              </div>
              <Button className="w-100" onClick={handleCheckout} disabled={cartItems.length === 0}>
                Checkout
              </Button>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default CartDrawer;
