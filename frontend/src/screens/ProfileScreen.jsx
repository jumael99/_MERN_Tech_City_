import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBangladeshiTakaSign } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Title from "../components/Title";
import {
  useGetOrderDetailsQuery,
  useDeliverOrderMutation,
} from "../slices/ordersApiSlice";

const OrderScreen = () => {
  // ... (previous code remains the same)

  const handlePrintInvoice = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice_${order?._id}`,
    onAfterPrint: () => toast.success("Invoice PDF generated successfully"),
  });

  // ... (rest of the component code remains the same)

  return (
    <>
      {/* ... (previous JSX remains the same) */}

      {/* Invoice content (hidden, used for PDF generation) */}
      <div style={{ display: "none" }}>
        <div
          ref={invoiceRef}
          style={{
            padding: "40px",
            fontFamily: "Arial, sans-serif",
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div>
              <img
                src="/api/placeholder/200/100"
                alt="Company Logo"
                style={{ maxWidth: "200px", height: "auto" }}
              />
            </div>
            <div style={{ textAlign: "right" }}>
              <h1 style={{ color: "#4a4a4a", marginBottom: "10px" }}>
                Invoice
              </h1>
              <p style={{ margin: "0", color: "#777" }}>
                Invoice #: {order._id}
              </p>
              <p style={{ margin: "0", color: "#777" }}>
                Date: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "40px",
            }}
          >
            <div>
              <h3 style={{ color: "#4a4a4a", marginBottom: "10px" }}>
                Bill To:
              </h3>
              <p style={{ margin: "0", color: "#777" }}>{order.user.name}</p>
              <p style={{ margin: "0", color: "#777" }}>{order.user.email}</p>
              <p style={{ margin: "0", color: "#777" }}>
                {order.shippingAddress.address}
              </p>
              <p style={{ margin: "0", color: "#777" }}>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p style={{ margin: "0", color: "#777" }}>
                {order.shippingAddress.country}
              </p>
            </div>
            <div>
              <h3 style={{ color: "#4a4a4a", marginBottom: "10px" }}>
                Ship To:
              </h3>
              <p style={{ margin: "0", color: "#777" }}>
                {order.shippingAddress.address}
              </p>
              <p style={{ margin: "0", color: "#777" }}>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p style={{ margin: "0", color: "#777" }}>
                {order.shippingAddress.country}
              </p>
            </div>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "40px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f8f8f8" }}>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Item
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "right",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Quantity
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "right",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Price
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "right",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {order.orderItems.map((item, index) => (
                <tr key={index}>
                  <td
                    style={{ padding: "12px", borderBottom: "1px solid #ddd" }}
                  >
                    {item.name}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {item.qty}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <FontAwesomeIcon icon={faBangladeshiTakaSign} />{" "}
                    {item.price.toFixed(2)}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "right",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <FontAwesomeIcon icon={faBangladeshiTakaSign} />{" "}
                    {(item.qty * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: "300px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span style={{ color: "#777" }}>Subtotal:</span>
                <span>
                  <FontAwesomeIcon icon={faBangladeshiTakaSign} />{" "}
                  {order.itemsPrice.toFixed(2)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span style={{ color: "#777" }}>Shipping:</span>
                <span>
                  <FontAwesomeIcon icon={faBangladeshiTakaSign} />{" "}
                  {order.shippingPrice.toFixed(2)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span style={{ color: "#777" }}>Tax:</span>
                <span>
                  <FontAwesomeIcon icon={faBangladeshiTakaSign} />{" "}
                  {order.taxPrice.toFixed(2)}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "2px solid #ddd",
                  paddingTop: "10px",
                  fontWeight: "bold",
                }}
              >
                <span>Total:</span>
                <span>
                  <FontAwesomeIcon icon={faBangladeshiTakaSign} />{" "}
                  {order.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "40px",
              borderTop: "1px solid #ddd",
              paddingTop: "20px",
              textAlign: "center",
              color: "#777",
            }}
          >
            <p>Thank you for your business!</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderScreen;
