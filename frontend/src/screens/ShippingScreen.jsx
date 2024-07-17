import React from 'react';
import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../slices/cartSlice';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = () => {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const [address,setAddress] = useState(shippingAddress?.address || '');
    const [city,setCity] = useState(shippingAddress?.city || '');
    const [postalCode,setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country,setCountry] = useState(shippingAddress?.country || '');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    

    const submitHandler = (e) => {
        e.preventDefault();
        
        dispatch(saveShippingAddress({ address,city,postalCode,country }));
        navigate('/payment');
    }

    // When I need to bundle two things we'll use 
    // Form.Group

    return (
        <FormContainer>
            <CheckoutSteps step1 />

            <h1 className='text-3xl my-2'>Shipping</h1>

            <Form onSubmit={submitHandler}>
                <Form.Group className="my-2" controlId='address'>
                    <Form.Label>Address</Form.Label>
                    <Form.Control 
                    type="text" 
                    vlaue = {address}
                    placeholder="Enter address"
                    onChange={(e) => setAddress(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className="my-2" controlId='city'>
                    <Form.Label>City</Form.Label>
                    <Form.Control 
                    type="text" 
                    vlaue = {city}
                    placeholder="Enter city"
                    onChange={(e) => setCity(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className="my-2" controlId='postalcode'>
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control 
                    type="text" 
                    vlaue = {postalCode}
                    placeholder="Enter city"
                    onChange={(e) => setPostalCode(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group className="my-2" controlId='country'>
                    <Form.Label>Country</Form.Label>
                    <Form.Control 
                    type="text" 
                    vlaue = {country}
                    placeholder="Enter Country"
                    onChange={(e) => setCountry(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary' className='my-2'>
                    Continue    
                </Button>

            </Form>
        </FormContainer>
    );
};

export default ShippingScreen;