import { Container } from 'react-bootstrap';

export default function Footer() {
    return (
        <footer
          style={{ backgroundColor: "#00ff84" }}
          className="border-top border-2 text-center py-5 mt-auto"
        >
          <Container>{`${new Date().getFullYear()} - © Strive School | Developed for homework projects.`}</Container>
        </footer>
      );
}
