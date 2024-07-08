import { Container } from 'react-bootstrap';

export default function Footer() {
    return (
        <footer
          style={{ color:"#00ff84" }}
          className="border-top text-center py-5 bg-dark mt-auto"
        >
          <Container>{`${new Date().getFullYear()} - © Strive School | Developed for homework projects.`}</Container>
        </footer>
      );
}
