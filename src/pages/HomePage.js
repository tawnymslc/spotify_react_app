import React, { useState } from "react";
import { Button, Container, Col, Row } from 'reactstrap';
import axios from "axios";

const HomePage = () => {

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState(null);

    const API_ENDPOINT = "https://api.spotify.com/v1/search?";

    let accessToken;

    const handleInputChange = (event) => {
        setSearchQuery(event.target.value);
    };

        const handleSearchSubmit = async (event) => {
            event.preventDefault();
        
            try {
                const response = await axios.post('http://localhost:4244/get-access-token');
                const accessToken = response.data.accessToken;
                console.log('Received access token:', accessToken);
        
                const searchResponse = await axios.get(API_ENDPOINT, {
                    params: { q: searchQuery, type: "artist" },
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
        
                setSearchResults(searchResponse);
                console.log("This is the log: ", searchResponse);
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
        </Container>
        </>
    );
};

export default HomePage

