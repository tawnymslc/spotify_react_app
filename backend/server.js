const express = require('express');
const app = express();
const bodyParser = require("body-parser")
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

app.use(cors());

const port = 4244;

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/get-access-token', async (req, res) => {
    try {
        const accessToken = await obtainAccessToken();
        console.log(accessToken);
        res.json({ accessToken });
    } catch (error) {
        console.error('Error obtaining access token:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function obtainAccessToken() {
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            'grant_type=client_credentials',
            {
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error obtaining access token:', error);
        throw error; // Rethrow the error for proper handling in the calling function
    }
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});