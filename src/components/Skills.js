
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import skills from "../assets/img/skills.png"

import react from "../assets/img/react.png"
import node from "../assets/img/nodejs.png"
import mongo from "../assets/img/mongodb.png"
import boot from "../assets/img/bootstrap.png"
import cpp from "../assets/img/cpp.png"
import py from "../assets/img/python.png"
import js from "../assets/img/JavaScript.png"

export const Skills = () => {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  return (
    <section className="skill" id="skills">
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <div className="skill-bx wow zoomIn">
                        <h2>Tech Stack</h2>
                        <p>These are the technologies I have worked with as a Computer Science student. I am consistently trying to improve my skills in all of these and I am open to explore further.</p>
                        <Carousel responsive={responsive} autoPlay = {true} autoPlaySpeed={1500} infinite={true} className="owl-carousel owl-theme skill-slider">
                            <div className="item">
                                <img src={react} alt="Image1" />
                            </div>
                            <div className="item">
                                <img src={node} alt="Image2" />
                            </div>
                            <div className="item">
                                <img src={mongo} alt="Image3" />
                            </div>
                            <div className="item">
                                <img src={cpp} alt="Image4" />
                            </div>
                            <div className="item">
                                <img src={py} alt="Image4" />
                            </div>
                            <div className="item">
                                <img src={js} alt="Image4" />
                            </div>
                            <div className="item">
                                <img src={boot} alt="Image4" />
                            </div>
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
        <img className="background-image-left" src={skills} alt="Image5" />
    </section>
  )
}
