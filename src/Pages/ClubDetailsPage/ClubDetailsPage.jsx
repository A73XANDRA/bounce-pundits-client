import { useNavigate, useParams } from 'react-router-dom'
import './ClubDetailsPage.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import ClubImgCarousel from './../../components/ClubImgCarousel/ClubImgCarousel'
import { Col, Row, Button, Image, DropdownButton, Dropdown, Modal, Tabs, Tab } from 'react-bootstrap'
import SmoothScroll from './../../components/SmoothScroll/SmoothScroll/'
import Spinner from './../../components/Spinners/Spinner'
import ClubMap from './../../components/ClubMap/ClubMap'
import CreateReviewForm from './../../components/CreateReviewForm/CreateReviewForm'
import EditReviewForm from './../../components/EditReviewForm/EditReviewForm'
import EditClubForm from './../../components/EditClubForm/EditClubForm'

const ClubDetailsPage = () => {

    const API_URL = import.meta.env.VITE_API_URL

    const { id } = useParams()

    const navigate = useNavigate()

    const [club, setClub] = useState()
    const [reviews, setReviews] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const [showModal, setShowModal] = useState(false)
    const [showReviewModal, setShowReviewModal] = useState(false)

    const [key, setKey] = useState('reviews')

    useEffect(() => {
        fetchClub()
        fetchReviews()
    }, [])

    const fetchClub = () => {
        axios
            .get(`${API_URL}/clubs/${id}`)
            .then((response) => {
                setClub(response.data)
                setIsLoading(false)
            })
            .catch(err => console.log(err))
    }

    const fetchReviews = () => {
        axios
            .get(`${API_URL}/clubs/${id}?_embed=reviews`)
            .then((response) => {
                setReviews(response.data.reviews)
            })
            .catch(err => console.log(err))
    }

    const deleteReview = reviewId => {
        axios
            .delete(`${API_URL}/reviews/${reviewId}`)
            .then(res => fetchReviews())
            .catch((error) => console.log(error))
    }

    return (
        <div className="ClubDetailsPage">
            {isLoading
                ? <Spinner />
                : <div className='ClubDetailsPage'>

                    <ClubImgCarousel pictures={club.pictures} />
                    <SmoothScroll data-bs-theme='dark' />

                    <section id="info">

                        <h2>{club.name}</h2>
                        <hr />
                        <Row>
                            <Col>
                                <h3>Servicios:</h3>

                                <ul>
                                    {
                                        club.services.map(elm => <li key={elm.name}>{elm.name}</li>)
                                    }

                                </ul>
                            </Col>
                            <Col>
                                <h3>Deportes disponibles:</h3>
                                <ul>
                                    {
                                        club.facilities.map(elm => <li key={elm.name}>{elm.name}</li>)
                                    }
                                </ul>
                            </Col>
                        </Row>

                        <h4>Contacto:</h4>
                        <a href='https://www.padelsporthome.com/'><p>🌐{club.contact.web}</p></a>
                        <p>📞{club.contact.phone}</p>
                        <p>📧{club.contact.email}</p>
                        <Button className='editbtn' variant='dark' onClick={() => setShowModal(true)}>Editar club</Button>

                        <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
                            <Modal.Header closeButton>
                                <Modal.Title>Editar club</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <EditClubForm setShowModal={setShowModal} fetchClub={fetchClub} />
                            </Modal.Body>
                        </Modal>


                    </section>

                    <section id="howToGet">
                        <div className="clubMap">
                            <ClubMap location={club.location} />
                            <p> <strong>{club.address}, {club.zipCode},{club.town}, {club.city}</strong></p>
                        </div>

                    </section>

                    <section id="reviews" >
                        <Tabs
                            id="controlled-tab-example"
                            activeKey={key}
                            onSelect={(k) => setKey(k)}
                            className="mb-3"
                            fill='true'

                        >
                            <Tab eventKey="reviews" title="Reseñas">
                                {
                                    reviews.map(eachReview => {

                                        return (
                                            <div key={eachReview.id} className="review">
                                                <Row  >
                                                    <Col xs={{ span: 3 }} md={{ span: 2 }} lg={{ span: 1 }} className="d-flex justify-content-center align-items-start pt-2">
                                                        <Image className='imgUserReview' roundedCircle={true} src="https://res.cloudinary.com/dshhkzxwr/image/upload/v1722773773/divertida-caricatura-de-aguacate-pegatina_u0nhfh.jpg" />
                                                    </Col>
                                                    <Col className="d-flex flex-column justify-content-start">
                                                        <Row>
                                                            <Col>
                                                                <h6> {eachReview.user} | {eachReview.date}</h6>
                                                                <p>RATING: {eachReview.rating}</p>
                                                            </Col>
                                                            <Col className="d-flex flex-row justify-content-end">

                                                                <DropdownButton variant="outline-dark" id="dropdown-basic-button" title="...">

                                                                    <Dropdown.Item onClick={() => setShowReviewModal(true)}>Editar reseña</Dropdown.Item>

                                                                    <Modal
                                                                        size="sm"
                                                                        show={showReviewModal}
                                                                        onHide={() => setShowReviewModal(false)}
                                                                    >
                                                                        <Modal.Header closeButton>
                                                                            <Modal.Title>Editar reseña</Modal.Title>
                                                                        </Modal.Header>
                                                                        <Modal.Body>
                                                                            <EditReviewForm setShowReviewModal={setShowReviewModal} reviewId={eachReview.id} fetchReviews={fetchReviews} />
                                                                        </Modal.Body>
                                                                    </Modal>
                                                                    <Dropdown.Item href="#/action-2" onClick={() => deleteReview(eachReview.id)}>Delete</Dropdown.Item>
                                                                </DropdownButton>

                                                            </Col>
                                                        </Row>
                                                        <p>{eachReview.comment}</p>

                                                    </Col>
                                                </Row>
                                            </div>
                                        )

                                    })
                                }
                            </Tab>
                            <Tab eventKey="addReview" title="Añadir reseña">
                                <CreateReviewForm fetchReviews={fetchReviews} clubId={id} setKey={setKey} />
                            </Tab>

                        </Tabs>

                    </section>

                </div >
            }

        </div >
    )
}

export default ClubDetailsPage