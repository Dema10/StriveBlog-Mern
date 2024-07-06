import { Container } from 'react-bootstrap';

export default function Footer() {
    return (
        <footer
          style={{
            paddingTop: 50,
            paddingBottom: 50,
          }}
          className='text-center'
        >
          <Container>{`${new Date().getFullYear()} - © Strive School | Developed for homework projects.`}</Container>
        </footer>
      );
}
