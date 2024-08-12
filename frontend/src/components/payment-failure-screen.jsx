import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Title from '../components/Title'

const PaymentFailureScreen = () => {
  const { tranId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (tranId) {
      // You might want to dispatch an action to update the order status
      // For now, we'll just redirect to the order page
      navigate(`/order/${tranId}`);
    }
  }, [tranId, navigate]);

  return (
    <div>
      <Title>Payment Failed</Title>
      <p>Your payment was not successful. Redirecting to order details...</p>
    </div>
  );
};

export default PaymentFailureScreen;
