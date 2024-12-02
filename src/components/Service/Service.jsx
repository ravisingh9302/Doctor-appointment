import React from 'react'
import SubHeader from '../Shared/SubHeader'
import Footer from '../Shared/Footer/Footer'
import Header from '../Shared/Header/Header'
import img from '../../images/features/baby.png'
import { Link } from 'react-router-dom'
import doctorBg from '../../images/img/doctors-bg.jpg';

const Service = () => {
  const weArePleaseStyle = {
    backgroundColor: "antiquewhite",
    height: "60vh",
    background: `url(${doctorBg}) no-repeat`,
    backgroundPosition: 'center center',
    backgroundSize: 'cover',
    padding: "10px",
    position: "relative",
    marginTop: 200,
    marginBottom: 100
  }
  return (
    <>
      <Header />
      <SubHeader title="Service" subtitle="Lorem ipsum dolor sit amet consectetur adipisicing." />

      <div className="container" style={{ marginTop: 200, marginBottom: 100 }}>
        <div className="row">
          {/* { */}
            {/* Array(6).fill(null).map((_item, id) => ( */}
              <div className="col-lg-4 col-md-6 col-sm-6" >
                <div className="card shadow border-0 mb-5">
                  <img src="http://localhost:3000/static/media/doctor%20chair%202.fc978c794010fb342906.jpg" alt="" className="img-fluid" style={{ maxHeight: '17rem', objectFit: 'cover' }} />
                  <div className="p-2">
                    <h4 className="mt-4 mb-2">Cardiology</h4>
                    <p className="mb-4">Heart Health, Diagnostic Tests, and Interventions</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-6" >
                <div className="card shadow border-0 mb-5">
                  <img src="http://localhost:3000/static/media/feature-03.83604bf3f6914c5df51f.jpg" alt="" className="img-fluid" style={{ maxHeight: '17rem', objectFit: 'cover' }} />
                  <div className="p-2">
                    <h4 className="mt-4 mb-2">Orthopedics</h4>
                    <p className="mb-4">Bone and Joint , Fracture Management, Surgeries</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-6" >
                <div className="card shadow border-0 mb-5">
                  <img src="http://localhost:3000/static/media/doc4.d31b4e01c956c47f2afa.jpg" alt="" className="img-fluid" style={{ maxHeight: '17rem', objectFit: 'cover' }} />
                  <div className="p-2">
                    <h4 className="mt-4 mb-2">Neurology</h4>
                    <p className="mb-4">Brain and Nervous System Disorders</p>
                  </div>
                </div>
              </div>


              <div className="col-lg-4 col-md-6 col-sm-6" >
                <div className="card shadow border-0 mb-5">
                  <img src="http://localhost:3000/static/media/doctor%205.16782b3788099896f9d6.jpg" alt="" className="img-fluid" style={{ maxHeight: '17rem', objectFit: 'cover' }} />
                  <div className="p-2">
                    <h4 className="mt-4 mb-2">Gastroenterology</h4>
                    <p className="mb-4"> Digestive Health and Treatments</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-sm-6" >
                <div className="card shadow border-0 mb-5">
                  <img src={img} alt="" className="img-fluid" style={{ maxHeight: '17rem', objectFit: 'cover' }} />
                  <div className="p-2">
                    <h4 className="mt-4 mb-2">Dermatology</h4>
                    <p className="mb-4">Skin, Hair, and Nail Treatments</p>
                  </div>
                </div>
              </div>
            {/* )) */}
          {/* } */}
        </div>
      </div>

      <section style={weArePleaseStyle}>
        <div className="container" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          <div className="row">
            <div className="col-lg-7">
              <div className="d-flex align-items-center">
                <div className='mb-4 section-title text-center'>
                  <h2 className='text-uppercase'>We are pleased to offer you the</h2>
                  <p className='form-text'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Id, sed.</p>
                  <Link to={'/doctors'} className="btn-get-started scrollto">Get Started</Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>


      <Footer />
    </>
  )
}

export default Service