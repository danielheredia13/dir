import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../app/store";
import { useNavigate } from "react-router-dom";
import { details } from "../features/userDetailsSlice";
import { update } from "../features/userUpdateSlice";
import { deleteUser } from "../features/userDeleteSlice";
import { logout } from "../features/userLoginSlice";
import { reset } from "../features/userDetailsSlice";
import { registerReset } from "../features/userRegisterSlice";
import Message from "../Components/Message";
import Loader from "../Components/Loader";

const ProfileScreen = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);

  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { userInfo } = userLogin;

  const userDetails = useSelector((state: RootState) => state.userDetails);
  const { userInfo: user } = userDetails;

  const userUpdate = useSelector((state: RootState) => state.userUpdate);
  const { loading, error } = userUpdate;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (user === null) {
        dispatch(details());
      } else if (user && user.name) {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [userInfo, user, dispatch, navigate]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    if (password === confirmPassword) {
      dispatch(
        update({
          name,
          email,
          password,
        })
      );
      e.preventDefault();
      dispatch(details());
      setPassword("");
      setConfirmPassword("");
    }
  };

  const deleteAcount = () => {
    if (window.confirm("Borrar cuenta ?")) {
      dispatch(deleteUser());
      dispatch(logout());
      dispatch(reset());
      dispatch(registerReset());
      navigate("/");
    }
  };

  const errorReset = () => {
    setErrorMessage(false);
  };

  return (
    <Container>
      <Row>
        <Col md={4}>
          <Button onClick={() => navigate("/")} className="mt-3 rounded">
            Atras
          </Button>
          {error && errorMessage && (
            <Message errorReset={errorReset} variant="danger" text={error} />
          )}
          {loading && <Loader />}
          <h2 className="mt-3">Perfil</h2>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label className="mb-1 mt-2">Nombre</Form.Label>
              <Form.Control
                className="rounded"
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
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
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="confirmPassword">
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
              Actualizar
            </Button>
          </Form>
          <Button
            onClick={deleteAcount}
            className="my-3 rounded"
            variant="danger"
          >
            Eliminar Cuenta
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileScreen;
