import React from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { logout } from "../features/userLoginSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { RootState } from "../app/store";
import { getNotesReset } from "../features/noteByUserSlice";
import { getNoteByIdReset } from "../features/noteByIdSlice";
import { registerReset } from "../features/userRegisterSlice";
import { reset } from "../features/userDetailsSlice";

const Header: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, void, AnyAction>>();
  const userInfo = useSelector((state: RootState) => state.userLogin.userInfo);

  const navigate = useNavigate();

  const logOutHandler = () => {
    dispatch(logout());
    dispatch(getNotesReset());
    dispatch(getNoteByIdReset());
    dispatch(registerReset());
    dispatch(reset());
    navigate("/");
  };
  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container>
        <Link to="/">
          <Navbar.Brand>Notes Kepeer</Navbar.Brand>
        </Link>
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="d-flex justify-content-end"
          >
            <Nav>
              {userInfo && userInfo.name ? (
                <NavDropdown title={`${userInfo.name}`} id="basic-nav-dropdown">
                  <Container>
                    <Link className="mx-1" to={`/profile/${userInfo._id}`}>
                      Perfil
                    </Link>
                  </Container>

                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logOutHandler}>
                    Cerrar Sesion
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Link to="/login">
                  <i className="fas fa-user" /> Iniciar Sesion
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Container>
    </Navbar>
  );
};

export default Header;
