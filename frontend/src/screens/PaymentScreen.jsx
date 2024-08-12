import { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';
import Title from '../components/Title'

const PaymentScreen = () => {

    const navigate = useNavigate();
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        }
    }, [navigate, shippingAddress]);

    const [paymentMethod, setPaymentMethod] = useState('sslcommerz');

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    };


    return (
    <FormContainer>
        <CheckoutSteps step1 step2 step3 />
        <Title>Payment Method</Title>
        <Form onSubmit={submitHandler}>
            <Form.Group>
                <Form.Label as='legend'>Select Method</Form.Label>
                <Col>
                    <Form.Check
                        type='radio'
                        className='my-2'
                        label='sslcommerz'
                        id='sslcommerz'
                        name='paymentMethod'
                        value='sslcommerz'
                        checked
                        onChange={(e)=>setPaymentMethod(e.target.value)}
                    ></Form.Check>
                </Col>
                </Form.Group>

                <Button type='submit' variant='primary'>
                    Continue
                </Button>
                </Form>
    </FormContainer>
  )
}

export default PaymentScreen