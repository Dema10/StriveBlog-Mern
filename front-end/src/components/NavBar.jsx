import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function NavBar() {
    return (
        <Navbar bg="dark" expand="lg" data-bs-theme="dark">
          <Container>
            <Navbar.Brand as={Link} to="/">
                <img style={{ 
                  width: '140px',
                  filter: 'invert(1) brightness(100)',
                  mixBlendMode: 'difference' 
                }} alt="logo" src={logo} />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/newPost" className="fs-5 custom-link">New Post</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
    );
}
