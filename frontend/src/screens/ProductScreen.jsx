import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from "../slices/productsApiSlice";
import Rating from "../components/Rating";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { addToCart } from "../slices/cartSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBangladeshiTakaSign,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const [updateReview] = useUpdateReviewMutation();

  const [deleteReview] = useDeleteReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      if (editingReviewId) {
        await updateReview({
          productId,
          reviewId: editingReviewId,
          rating,
          comment,
        }).unwrap();
        toast.success("Review updated successfully");
        setEditingReviewId(null);
      } else {
        await createReview({
          productId,
          rating,
          comment,
        }).unwrap();
        toast.success("Review created successfully");
      }
      setRating(0);
      setComment("");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const editReviewHandler = (review) => {
    setEditingReviewId(review._id);
    setRating(review.rating);
    setComment(review.comment);
  };

  const deleteReviewHandler = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview({ productId, reviewId }).unwrap();
        toast.success("Review deleted successfully");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  useEffect(() => {
    if (!editingReviewId) {
      setRating(0);
      setComment("");
    }
  }, [editingReviewId]);

  const imageUrl = product
    ? `http://localhost:5000${product.image.startsWith("/") ? "" : "/"}${product.image.replace(/\\/g, "/")}`
    : "";

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Row>
            <Col md={6} className="mb-4 mb-md-0">
              <div className="w-full max-w-md mx-auto overflow-hidden rounded-lg shadow-md">
                <div className="aspect-w-1 aspect-h-1">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      console.error("Image failed to load:", imageUrl);
                      e.target.src = "https://via.placeholder.com/400";
                      e.target.alt = "Image not found";
                    }}
                  />
                </div>
              </div>
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  Price: <FontAwesomeIcon icon={faBangladeshiTakaSign} />{" "}
                  {product.price}
                </ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>
                          <FontAwesomeIcon icon={faBangladeshiTakaSign} />{" "}
                          {product.price}
                        </strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        {product.countInStock > 0 ? "In Stock" : "Out Of Stock"}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={qty}
                            onChange={(e) => setQty(Number(e.target.value))}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              ),
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={addToCartHandler}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className="review">
            <Col md={6}>
              <h2 className="my-3">Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews</Message>}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                    {userInfo && userInfo._id === review.user && (
                      <div>
                        <Button
                          variant="light"
                          className="btn-sm mr-2"
                          onClick={() => editReviewHandler(review)}
                        >
                          <FontAwesomeIcon icon={faEdit} /> Edit
                        </Button>
                        <Button
                          variant="danger"
                          className="btn-sm"
                          onClick={() => deleteReviewHandler(review._id)}
                        >
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </Button>
                      </div>
                    )}
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>

                  {loadingProductReview && <Loader />}

                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group className="my-2" controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          required
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className="my-2" controlId="comment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          required
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button
                        disabled={loadingProductReview}
                        type="submit"
                        variant="primary"
                      >
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to="/login">sign in</Link> to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
