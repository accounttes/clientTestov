import { Navbar, Container, Nav } from "react-bootstrap";
import { useLocation } from "react-router-dom";

const HeaderLayout = ({ children }: any) => {
  const location = useLocation();

  return (
    <>
      <Navbar className="fs-4" bg="primary" variant="dark">
        <Container>
          <Nav className="me-auto">
            <Nav.Link href="account" active={location.pathname === "/account"}>
              Моя страница
            </Nav.Link>
            <Nav.Link href="people" active={location.pathname === "/people"}>
              Люди
            </Nav.Link>
            <Nav.Link href="/" active={location.pathname === "/"}>
              Регистрация
            </Nav.Link>
            <Nav.Link href="auth" active={location.pathname === "/auth"}>
              Вход
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      {children}
    </>
  );
};

export default HeaderLayout;
