import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { Container } from 'react-bootstrap';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import NewPost from './pages/NewPost';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import PostDetail from './pages/PostDetail';
import SingUp from './pages/SingUp';
import Login from './pages/Login';

export default function App() {
 

  return (
    <>
      <BrowserRouter>
        <div className="d-flex flex-column min-vh-100">
          <NavBar />
          <Container>
            <Routes>
              <Route path="/signup" element={<SingUp />} />
              <Route path="/login" element={<Login />} />
              <Route index element={ <Home /> } />
              <Route path="/newPost" element={ <NewPost /> } />
              <Route path="/post/:id" element={ <PostDetail /> } />
              <Route path="*" element={ <NotFound /> } />
            </Routes>
          </Container>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  )
}

