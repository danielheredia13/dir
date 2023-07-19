import React, { useState, useEffect } from "react";
import { Container, Form, Col, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { useNavigate } from "react-router-dom";
import { register } from "../features/userRegisterSlice";
import { RootState } from "../app/store";
import { login } from "../features/userLoginSlice";
import Message from "../Components/Message";
import Loader from "../Components/Loader";

const RegisterScreen = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [MessageText, setMessageText] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);

  const userRegister = useSelector((state: RootState) => state.userRegister);
  const { userInfo, loading, error } = userRegister;
  const userEmail = userInfo.email;

  useEffect(() => {
    const navigateHome = () => {
      let email = userEmail;
      let password = loginPassword;

      dispatch(login({ email, password }));

      navigate("/");
    };

    if (userInfo && userInfo._id) {
      navigateHome();
    }
  }, [userInfo, navigate, dispatch, loginPassword, userEmail]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    if (password !== confirmPassword) {
      setMessageText("Password y confirmacion de password no son iguales");
    } else {
      dispatch(
        register({
          name,
          email,
          password,
        })
      );
    }
    e.preventDefault();

    setLoginPassword(password);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const errorReset = () => {
    setErrorMessage(false);
    setMessageText("");
  };

  return (
    <Container className="login-container">
      <h2 className="mt-4">Registro</h2>
      {MessageText && (
        <Message errorReset={errorReset} variant="danger" text={MessageText} />
      )}
      {error && errorMessage && (
        <Message errorReset={errorReset} variant="danger" text={error} />
      )}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="nombre">
          <Form.Label className="mb-1 mt-2">Nombre</Form.Label>
          <Form.Control
            className="rounded"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="email">
          <Form.Label className="mb-1 mt-2">Correo Electronico</Form.Label>
          <Form.Control
            className="rounded"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label className="mb-1 mt-2">Pasword</Form.Label>
          <Form.Control
            className="rounded"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="Confirmpassword">
          <Form.Label className="mb-1 mt-2">Confirmar Pasword</Form.Label>
          <Form.Control
            className="rounded"
            type="password"
            placeholder="Confirmar Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" className="my-3 rounded" variant="primary">
          Registrarme
        </Button>
      </Form>
      <Row>
        <Col>
          Ya estas registrado ? <Link to="/login">Inicia Sesion</Link>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterScreen;
