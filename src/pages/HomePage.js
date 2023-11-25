import React, { useState } from "react";
import { Button, Container, Col, Row, Card, 
    CardBody, 
    CardImg, 
    CardText, 
    CardTitle, 
    CardFooter } from 'reactstrap';
import axios from "axios";

const HomePage = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [tracks, setTracks] = useState(null);

    const API_ARTIST_ID = "https://api.spotify.com/v1/search?";

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
    
        try{
            const response = await axios.post('http://localhost:4244/get-access-token');
            const accessToken = response.data.accessToken;
            console.log('Received access token:', accessToken);
    
            const searchResponse = await axios.get(API_ARTIST_ID, {
                params: { q: searchQuery, type: "artist" },
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const artistId = searchResponse.data.artists.items[0].id;
            console.log(artistId);
            setSearchResults(searchResponse);
            console.log("This is the log: ", searchResponse);

            const tracksResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            setTracks(tracksResponse.data.tracks);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return(
        <>
        <Container className="container-fluid" style={{ backgroundColor: 'black', height: '100vh' }}>
            <Row sm={11} className="justify-content-center">
                <Col xs='auto' className="mx-auto" style={{ marginTop: '40px' }}>
                    <form onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            className="custom-search-bar" 
                            value={searchQuery}
                            onChange={handleInputChange}
                        />
                        <Button 
                            type='submit' 
                            style={{ backgroundColor: 'rgb(77, 72, 242)', marginBottom: '4px' }}>
                            Search
                        </Button>
                    </form>
                </Col>
            </Row>
            <Container style={{ marginTop: '30px' }}>
                <Row className="justify-content-center">
                {tracks && tracks.map((track, index) => (
                <Col md={3} className="m-4 text-center">
                    <Card className='domain-card'>
                        <CardBody className='domain-card-body'>
                            <CardImg 
                            />
                            <CardTitle>{track.name}</CardTitle>
                            <CardText> </CardText>
                        </CardBody>
                        <CardText style={{ marginTop: '15px', fontWeight: 'bold'}}></CardText>
                        <CardFooter style={{ display: 'flex', justifyContent: 'center' }}>
                        </CardFooter>
                    </Card>
                </Col>
                ))}
            </Row>
            </Container>
        </Container>
        </>
    );
};

export default HomePage

