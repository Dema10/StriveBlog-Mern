import { useEffect, useState } from "react";
import { getPosts } from "../services/api";
import { Col, Row } from "react-bootstrap";
import Post from "../components/Post";
import { useNavigate } from "react-router-dom";
import Search from "../components/Search";


export default function Home() {

  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");
      console.log(token);
      try {
        const response = await getPosts();
        setPosts(response.data.posts);
        setFilteredPosts(response.data.posts);       
      } catch (err) {
        console.error('Errore nella get di tutti i post', err);
        navigate("/login")
      }
    };
    fetchPosts();
  }, []);

  const handlerSearch = (e) => {
    const searchPost = e.target.value.toLowerCase();
    setSearch(searchPost);
    const filtered = posts.filter(post => 
      post.title.toLowerCase().includes(searchPost)
    );
    setFilteredPosts(filtered);
  };

  return (
    <Row className="mb-4">
      <Col>
        <h1 style={{ color:"#00ff84" }} className="text-center my-4">I Post di Strive Blog!</h1>
        <Search search={search} handlerSearch={handlerSearch} />
        <Row>
          <Post posts={filteredPosts} />
        </Row>
      </Col>
    </Row>
  )
}
