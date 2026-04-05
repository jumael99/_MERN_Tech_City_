import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Form, Row, Col } from "react-bootstrap";
import { FaTimes, FaDownload } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";
import { Link } from "react-router-dom";
import Title from "../../components/Title";
import { useReactToPrint } from "react-to-print";
import { faBangladeshiTakaSign } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showPaidOnly, setShowPaidOnly] = useState(false);

  const componentRef = useRef();

  useEffect(() => {
    if (orders) {
      let result = [...orders];

      // Filter by user
      if (userSearch) {
        result = result.filter(
          (order) =>
            order.user &&
            order.user.name.toLowerCase().includes(userSearch.toLowerCase()),
        );
      }

      // Filter by date range
      if (dateFrom && dateTo) {
        result = result.filter((order) => {
          const orderDate = new Date(order.createdAt.split("T")[0]);
          const fromDate = new Date(dateFrom);
          const toDate = new Date(dateTo);
          toDate.setHours(23, 59, 59, 999); // Set to end of day
          return orderDate >= fromDate && orderDate <= toDate;
        });
      }

      // Filter paid orders
      if (showPaidOnly) {
        result = result.filter((order) => order.isPaid);
      }

      setFilteredOrders(result);
    }
  }, [orders, userSearch, dateFrom, dateTo, showPaidOnly]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Orders_List",
    onAfterPrint: () => alert("PDF downloaded successfully!"),
  });

  return (
    <>
      <Title>Orders</Title>
      <Row className="mb-3 align-items-center">
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Search by user"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Form.Control
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Form.Control
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Check
            type="checkbox"
            label="Show Paid Orders Only"
            checked={showPaidOnly}
            onChange={(e) => setShowPaidOnly(e.target.checked)}
          />
        </Col>
        <Col md={2}>
          <Button onClick={handlePrint} variant="success">
            <FaDownload /> Download PDF
          </Button>
        </Col>
      </Row>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div ref={componentRef}>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user && order.user.name}</td>
                  <td>{order.createdAt?.substring(0, 10)}</td>
                  <td>
                    <FontAwesomeIcon
                      icon={faBangladeshiTakaSign}
                      className="mr-1"
                    />
                    {order.totalPrice}
                  </td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt?.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt?.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: "red" }} />
                    )}
                  </td>
                  <td>
                    <Button
                      as={Link}
                      to={`/order/${order._id}`}
                      variant="light"
                      className="btn-sm"
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
};

export default OrderListScreen;
