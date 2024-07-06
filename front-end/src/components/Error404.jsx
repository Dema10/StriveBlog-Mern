
import { Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Error404() {

    const navigate = useNavigate();

  return (
    <Alert variant="danger" className="text-center">
          <h1 className="fs-1">RICERCA SBAGLIATA</h1>
          <h3 className="fs-1">ERROR 404!!!</h3>
          <Button onClick={() => navigate('/')} 
                  variant="warning"
                  className="w-100">
            RITORNA ALLA HOME!
          </Button>
    </Alert>  
  );
}