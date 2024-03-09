
<p align="center">
      <img
        src="https://media1.tenor.com/m/zZOt7alSzAMAAAAd/gojo-gojo-satoru.gif"
        width="120"
        height="120"
      />
    </p>

# <p align="center">Anime API</p>
>
>
<p align="center">API made with Node.js ( scrape data primarily from <a href="https://hianime.to" target="_blank">hianime.to</a> and secondarily from <a href="https://kaido.to" target="_blank">kaido.to</a> )</p>

# <span style="color:red">! Disclaimer !</span>

 1. Please don't spam the api. This api is deployed on a free web service. You can clone this repository to test it on your local server

 2. This api does not store any files , it only link to the media which is hosted on 3rd party services.

 3. This api is explicitly made for educational purposes only. This repo will not be responsible for any misuse of it

><h2> Table of Contents </h2>

- [Installation](#installation)
  - [Locally](#locally)
- [Deployment](#deployment)
  - [Render](#Render)
- [Documentation](#documentation)
- [Development](#development)
- [Showcases](#showcases)
- [Provider Request](#provider-request)
- [Support](#support)
- [Related repositories](#related-repositories)

># Installation
## Locally
Make sure you have node installed on your device

Run the following code to clone the repository and install all required dependencies

```bash
$ git clone https://github.com/itzzzme/anime-api.git
$ cd anime-api
$ npm install
```
Start the server
```bash
$ npm start #or npm run devStart
```
># Deployment
## Render
Host your own instance of anime-api on Render using this button below.
>
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/itzzzme/anime-api)


># Documentation

### `Get` Basic info

```bash
  GET /api/
```
### Endpoint
```bash
  https://anime-api-k3tm.onrender.com/api/
```
#### Example of request
```javascript
import axios from 'axios';
const resp=await axios.get('https://anime-api-k3tm.onrender.com/api/')
console.log(resp.data);
```

#### Sample Response
```javascript
{
  "success": true,
  "results": {
    "spotlights": [
      {
        "data_id": number,
        "poster": string,
        "title": string,
        "description": string,
        "tvInfo": {
          "showType": string,
          "duration": string,
          "releaseDate": string,
          "quality": string,
          "episodeInfo": [object]
        }
      },
      {...}
    ],
    "trending": [
      {
        "data_id": number,
        "number": number,
        "poster": string,
        "title": string
      },
      {
        "data_id": number,
        "number": number,
        "poster": string,
        "title": string
      },
      {...}
    ]
  }
}
```
