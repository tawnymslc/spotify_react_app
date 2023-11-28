import React, { useState } from "react";
import { Button, Container, Col, Row, Card, 
    CardBody, 
    CardImg, 
    CardText, 
 } from 'reactstrap';
import axios from "axios";
import spotify_bkg from '../img/spotify_bkg.jpg'

const HomePage = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [tracks, setTracks] = useState(null);

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = async (event) => {
        event.preventDefault();
    
        try{
            const response = await axios.post(process.env.REACT_APP_GET_TOKEN_URL);
            const accessToken = response.data.accessToken;
            console.log('Received access token:', accessToken);
    
            const searchResponse = await axios.get("https://api.spotify.com/v1/search?", {
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
        <div 
        style={{  backgroundImage: `url(${require('../img/wp2775382.jpg')})`}}>
        <Container className="container-fluid spotify-container">
            <Row sm={11} className="justify-content-center" style={{marginBottom: "40px"}}>
                <Col xs='auto' className="mx-auto" style={{ marginTop: '40px' }}>
                    <form onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            className="custom-search-bar" 
                            value={searchQuery}
                            onChange={handleInputChange}
                            style={{ textAlign: 'center', verticalAlign: 'middle' }}
                        />
                        <Button 
                            type='submit' 
                            style={{ backgroundColor: 'rgb(43, 92, 36)', color: 'white', lineHeight: "16px", display: 'inline-block', textAlign: 'center', fontWeight: 'bold'}}>
                            Search
                        </Button>
                    </form>
                </Col>
            </Row>
                <Row className="justify-content-center">
                {tracks && tracks.map((track, index) => (
                <Col md={3} className="m-4 text-center" key={index}>
                    <Card className='spotify-card' style={{backgroundColor: 'black'}}>
                    <CardBody>
                        <CardImg src={track.album.images[1].url} style={{padding: "-25px"}}></CardImg>
                        <CardText style={{ backgroundColor: "black", color: "white", display: 'flex', justifyContent: 'center', border: '5px', marginTop: '10px', fontWeight: 'bold' }}>
                            {track.name}
                        </CardText>
                        </CardBody>
                    </Card>
                </Col>
                ))}
            </Row>
        </Container>
        </div>
        </>
    );
};

export default HomePage

