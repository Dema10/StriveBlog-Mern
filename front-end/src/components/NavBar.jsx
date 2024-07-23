import { Button, Container, Image, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import { getAuthorData } from "../services/api";
import { BoxArrowRight, Person, PersonGear } from "react-bootstrap-icons";

export default function NavBar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authorData, setAuthorData] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    // Controlla se esiste un token nel localStorage
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const author = await getAuthorData();
          setAuthorData(author);
          setIsLoggedIn(true);
        } catch (err) {
          console.error("Token non trovato", err);
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setAuthorData(null);
        }
      } else {
        setIsLoggedIn(false);
        setAuthorData(null);
      }
    };

    // Controlla lo stato di login all'avvio
    checkLoginStatus();

    // Aggiungi un event listener per controllare lo stato di login
    window.addEventListener("storage", checkLoginStatus);

    // Rimuovi l'event listener quando il componente viene smontato
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

    return (
      <Navbar className="py-3" bg="dark" data-bs-theme="dark" expand="lg" data-custom-border>
      <Container fluid className="px-3">
        <Navbar.Brand as={Link} to="/">
          <img
            style={{
              width: '140px',
              filter: 'invert(1) brightness(100)'
            }}
            alt="logo"
            src={logo}
          />
        </Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isLoggedIn ? (
              <Nav.Link as={Link} to="/newPost" className="fs-5 custom-link">
                New Post
              </Nav.Link>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="fs-5 custom-link">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/signup" className="fs-5 custom-link">
                  Sign Up
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
        <div className="d-flex align-items-center">
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="me-3" />
          {isLoggedIn && (
              <NavDropdown 
                title={
                  <Image 
                    src={authorData.avatar}
                    roundedCircle 
                    style={{ width: '50px', height: '50px' }} 
                  />
                }
                menuVariant="dark"
                align="end"
              >
                <div className="d-flex">
                    <div className="m-2 ms-3"><img src={authorData.avatar} alt={authorData.name} style={{width: '50px', height: '50px'}}/></div>
                    <div className="m-2">
                        <h5 className="mb-0 text-nowrap">{authorData.name} {authorData.surname}</h5>
                        <p className="mb-0 opacity-50">{authorData.email}</p>
                    </div>
                </div>
                <NavDropdown.Divider style={{borderTopColor:"#00ff84"}}/>
                <div className="d-flex flex-column">
                  <Link className="custom-link text-decoration-none ps-2 mt-2"><Person className="pb-1 fs-5" /> Author Detail</Link> {/* TODO: creare una pagina per l'autore */}
                  <Link className="custom-link text-decoration-none ps-2 mt-2 mb-2"><PersonGear className="pb-1 fs-5" /> Profile</Link> {/* TODO: creare una pagina per le modifiche */}
                </div>
                <NavDropdown.Divider style={{borderTopColor:"#00ff84"}}/>
                <Button variant="outline" onClick={handleLogout} data-custom-btn className="ms-2 my-1">Logout <BoxArrowRight className="pb-1 fs-5" /></Button>
              </NavDropdown>
            )}
        </div>
      </Container>
    </Navbar>
  );
}
