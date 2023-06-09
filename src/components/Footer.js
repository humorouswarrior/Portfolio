import { Container, Row, Col } from "react-bootstrap";
import { Newsletter } from "../components/Newsletter";
import navIcon1 from "../assets/img/nav-icon1.svg";
import gitHub from "../assets/img/square-github.svg";
import navIcon3 from "../assets/img/nav-icon3.svg";

export const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="align-items-center">
        <Newsletter/>
          <Col size={12} sm={6}>
          <span className = "footertext">Looking forward to working together!</span>
          </Col>
          <Col size={12} sm={6} className="text-center text-sm-end">
            <div className="social-icon">
            <a href="https://www.linkedin.com/in/humorouswarrior/"><img src={navIcon1}  alt="" /></a>
                <a href="https://github.com/humorouswarrior"><img src={gitHub} alt="" /></a>
                <a href="https://www.instagram.com/vaibhav.khandelwal/"><img src={navIcon3} alt="" /></a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}
