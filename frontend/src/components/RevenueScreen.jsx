import React from "react";
import { Card } from "react-bootstrap";
import { useGetTotalRevenueQuery } from "../slices/ordersApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBangladeshiTakaSign } from "@fortawesome/free-solid-svg-icons";
import Title from "./Title";

const RevenueScreen = () => {
  const { data: revenueData, isLoading, error } = useGetTotalRevenueQuery();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gray-50 p-6">
      {/* Title with Tailwind styling for minimal look */}
      <Title className="text-2xl font-medium text-gray-800 mb-4">
        Total Revenue
      </Title>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Card className="w-full max-w-md border-0 shadow-md rounded-lg bg-white">
          <Card.Body className="p-6 text-center">
            <Card.Title className="text-lg font-semibold text-gray-700 mb-2">
              Total Revenue
            </Card.Title>
            <Card.Text className="text-2xl font-bold text-gray-800 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faBangladeshiTakaSign}
                className="mr-1 text-[#892CDB]"
              />
              {revenueData.totalRevenue}
            </Card.Text>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default RevenueScreen;
