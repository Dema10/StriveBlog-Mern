import { Container } from 'react-bootstrap';

export default function Footer() {
    return (
        <footer
          style={{ color:"#00ff84" }}
          className="position-absolute bottom-0 start-0 end-0 text-center py-5 bg-dark"
        >
          <Container>{`${new Date().getFullYear()} - © Strive School | Developed for homework projects.`}</Container>
        </footer>
      );
}
