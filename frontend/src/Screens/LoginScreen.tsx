import React, { useState, useEffect } from "react";
import { Container, Form, Col, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../app/store";
import { useNavigate } from "react-router-dom";
import { login } from "../features/userLoginSlice";
import Message from "../Components/Message";
import Loader from "../Components/Loader";

const LoginScreen = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);

  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo, loading, error } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.name) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    dispatch(login({ email, password }));

    e.preventDefault();

    setEmail("");
    setPassword("");
  };

  const errorReset = () => {
    setErrorMessage(false);
  };

  return (
    <Container className="login-container">
      {error && errorMessage && (
        <Message errorReset={errorReset} variant="danger" text={error} />
      )}
      {loading && <Loader />}
      <h2 className="mt-4">Iniciar Sesion</h2>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="email">
          <Form.Label className="mb-1 mt-2">Correo Electronico</Form.Label>
          <Form.Control
            className="rounded"
            type="email"
            placeholder="Correo Electronico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label className="mb-1 mt-2">Pasword</Form.Label>
          <Form.Control
            className="rounded"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" className="my-3 rounded" variant="primary">
          Iniciar Sesion
        </Button>
      </Form>
      <Row>
        <Col>
          Cliente Nuevo ? <Link to="/register">Registrate</Link>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginScreen;
