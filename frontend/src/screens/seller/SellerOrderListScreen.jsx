import React, { useState, useEffect } from "react";
import { Table, Button, Row, Col } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useGetSellerOrdersQuery,
  useGetSellerRevenueQuery,
} from "../../slices/ordersApiSlice";
import { Link } from "react-router-dom";
import Title from "../../components/Title";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBangladeshiTakaSign } from "@fortawesome/free-solid-svg-icons";

const SellerOrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetSellerOrdersQuery();
  const {
    data: revenueData,
    isLoading: revenueLoading,
    error: revenueError,
  } = useGetSellerRevenueQuery();

  return (
    <>
      <Row className="align-items-center">
        <Col>
          <Title>My Orders</Title>
        </Col>
        <Col className="text-right">
          <h2>
            Total Revenue: <FontAwesomeIcon icon={faBangladeshiTakaSign} />
            {revenueLoading ? <Loader /> : revenueData?.totalRevenue.toFixed(2)}
          </h2>
        </Col>
      </Row>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>
                  <FontAwesomeIcon
                    icon={faBangladeshiTakaSign}
                    className="mr-1"
                  />
                  {order.totalPrice}
                </td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: "red" }} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default SellerOrderListScreen;
