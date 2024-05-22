<p align="center">
      <img
        src="https://media1.tenor.com/m/zZOt7alSzAMAAAAd/gojo-gojo-satoru.gif"
        width="200"
        height="200"
      />
    </p>

# <p align="center">Anime API</p>

>

<p align="center">API made with Node.js ( scrape data primarily from <a href="https://hianime.to" target="_blank">hianime.to</a> and secondarily from <a href="https://kaido.to" target="_blank">kaido.to</a> )</p>

# <span style="color:red">! Disclaimer !</span>

1.  Please don't spam the `api`. This `api` is deployed on a free web service. You can clone this repository on your local server for testing purposes.

2.  This `api` does not store any files , it only link to the media which is hosted on 3rd party services.

3.  This `api` is explicitly made for educational purposes only and not for commercial usage. This repo will not be responsible for any misuse of it.

> <h2> Table of Contents </h2>

- [Installation](#installation)
  - [Local installation](#local-installation)
- [Deployment](#deployment)
  - [Render](#Render)
- [Documentation](#documentation)
- [Pull Requests](#pull-requests)
- [Reporting Issues](#reporting-issues)
- [Support](#support)

> # Installation

## Local installation

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

> # Deployment

### Vercel

Host your own instance of anime-api on vercel

[![Deploy to Vercel](https://camo.githubusercontent.com/0d115430c1db17132964386282927e5e313543c7d868fc06bc9a7c65d7ec974e/68747470733a2f2f76657263656c2e636f6d2f627574746f6e)](https://vercel.com/new/clone?repository-url=https://vercel.com/new/clone?repository-url=https://github.com/itzzzme/anime-api)

### Render

Host your own instance of anime-api on Render.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/itzzzme/anime-api)

> # Documentation

### `Get` Basic info

```bash
  GET /api/
```

### Endpoint

```bash
  https://anime-api-five-woad.vercel.app/api/
```

> #### No parameter required ❌

#### Example of request

```javascript
import axios from "axios";
const resp = await axios.get("https://anime-api-five-woad.vercel.app/api/");
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

### `Get` Top 10 anime's info

```bash
  GET /api/top-ten
```

### Endpoint

```bash
  https://anime-api-five-woad.vercel.app/api/info?id={string}
```

> #### No parameter required ❌

#### Example of request

```javascript
import axios from "axios";
const resp = await axios.get("https://anime-api-five-woad.vercel.app/api/top-ten");
console.log(resp.data);
```

#### Sample Response

```javascript
{
  "success": true,
  "results": [
    {
      "data_id": number,
      "number": number,
      "name": string,
      "poster": string,
      "tvInfo": [Object]
    },
    {
      "data_id": number,
      "number": number,
      "name": string,
      "poster": string,
      "tvInfo": [Object]
    },
    {..}
  ]
}
```

### `Get` specified anime's info

```bash
  GET /api/info
```

### Endpoint

```bash
  https://anime-api-five-woad.vercel.app/api/info?id={string}
```

#### Parameters

| Parameter |  Type  | Description | Mandatory ? | Default |
| :-------: | :----: | :---------: | :-------: | :-----: |
|   `id`    | string |  anime-id   |  Yes ✔️   |   --    |

#### Example of request

```javascript
import axios from "axios";
const resp = await axios.get(
  "https://anime-api-five-woad.vercel.app/api/info?id=yami-shibai-9-17879"
);
console.log(resp.data);
```

#### Sample Response

```javascript
{
  "success": true,
  "results": {
    "seasons": [
      {
        "data_number": number,
        "data_id": number,
        "season": string,
        "title": string,
        "season_poster": string
      },
      {...}
    ],
    "data": {
      "data_id": number,
      "title": string,
      "poster": string,
      "animeInfo": {
        "Overview": string,
        "Japanese": string,
        "Synonyms": string,
        "Aired": string,
        "Premiered": string,
        "Duration": string,
        "Status": string,
        "MAL Score": string,
        "Genres": [Object],
        "Studios": string,
        "Producers": [Object]
      }
    }
  }
}
```

### `Get` several categories info

```bash
  GET /api/<category>
```

### Endpoint

```bash
  https://anime-api-five-woad.vercel.app/api/{string}?page={number}
  #or
  https://anime-api-five-woad.vercel.app/api/{string}
```

#### Parameters

| Parameter  | Parameter-type | Data-type | Description | Mandatory ? | Default |
| :--------: | :------------: | :-------: | :---------: | :-------: | :-----: |
| `category` |     `path`     | `string`  | `Category`  |  Yes ✔️   |   --    |
|   `page`   |    `query`     | `number`  | `Page-no.`  |   No ❌   |   `1`   |

#### List of Categories

- top-airing
- most-popular
- most-favorite
- completed
- recently-updated
- recently-added
- top-upcoming
- subbed-anime
- dubbed-anime
- top-upcoming
- movie
- special
- ova
- ona
- tv

#### Example of request

```javascript
import axios from "axios";
const resp = await axios.get(
  "https://anime-api-five-woad.vercel.app/api/most-popular?page=1"
);
console.log(resp.data);
```

#### Sample Response

```javascript
{
  "success": true,
  "results": {
    "totalPages": number,
    "data": [
      {
        "data_id": number,
        "poster": string,
        "title": string,
        "description": string,
        "tvInfo": {
          "showType": string,
          "duration": string,
          "sub": number,
          "dub": number
        }
      },
      {
        "data_id": number,
        "poster": string,
        "title": string,
        "description": string,
        "tvInfo": {
          "showType": sting,
          "duration": string,
          "sub": number,
          "dub": number,
          "eps": number
        }
      },
      {...}
    ]
  }
}
```

### `Get` search result's info

```bash
  GET /api/search
```

### Endpoint

```bash
  https://anime-api-five-woad.vercel.app/api/search?keyword={string}
```

#### Parameters

| Parameter | Parameter-type |   Type   | Description | Mandatory ? | Default |
| :-------: | :------------: | :------: | :---------: | :-------: | :-----: |
| `keyword` |    `query`     | `string` |  `keyword`  |  Yes ✔️   |   --    |

#### Example of request

```javascript
import axios from "axios";
const resp = await axios.get(
  "https://anime-api-five-woad.vercel.app/api/search?keyword=one%20punch%20man"
);
console.log(resp.data);
```

#### Sample Response

```javascript
{
  "success": true,
  "results": [
    {
        "data_id": number,
        "poster": string,
        "title": string,
        "tvInfo": [Object]
      },
    {
        "data_id": number,
        "poster": string,
        "title": string,
        "tvInfo": [Object]
      },
    {
      "data_id": number,
      "poster": string,
      "title": string,
      "tvInfo": [Object]
    },
    {...}
  ]
}
```

### `Get` streaming info

```bash
  GET /api/stream
```

### Endpoint

```bash
  https://anime-api-five-woad.vercel.app/api/stream?id={string}
```

#### Parameters

| Parameter | Parameter-type |   Type   | Description | Mandatory ? | Default |
| :-------: | :------------: | :------: | :---------: | :-------: | :-----: |
|   `id`    |    `query`     | `string` |  `keyword`  |  Yes ✔️   |   --    |

#### Example of request

```javascript
import axios from "axios";
const resp = await axios.get(
  "https://anime-api-five-woad.vercel.app/api/stream?id=frieren-beyond-journeys-end-18542?ep=107257"
);
console.log(resp.data);
```

#### Sample Response

```javascript
{
  "success": true,
  "results": {
    "streamingInfo": [
      {
        "status": "fulfilled",
        "value": {
          "decryptionResult": {
            "link": string,
            "server": string,
            "type": "dub"
          },
          "subtitleResult": {
            "subtitles": [
              {
                "file": string,
                "label": string,
                "kind": string,
                "default": boolean
              },
              {
                "file": string,
                "kind": string
              }
            ],
            "intro": [Object],
            "outro": [Object]
          }
        }
      },
      {...},
      {
        "status": "fulfilled",
        "value": {
          "decryptionResult": {
            "link": string,
            "server": string,
            "type": "sub"
          },
          "subtitleResult": {
            "subtitles": [
              {
                "file": string,
                "label": string,
                "kind": string
              },
              {...}
            ],
            "intro": [Object],
            "outro": [Object]
          }
        }
      },
      {...}
    ],
    "episodes": [
      {
        "data_id": number,
        "episode_no": number,
        "title": string,
        "japanese_title": string
      },
      {...}
    ]
  }
}
```

>### Pull Requests

- Pull requests are welcomed that address bug fixes, improvements, or new features.
- Fork the repository and create a new branch for your changes.
- Ensure your code follows our coding standards.
- Include tests if applicable.
- Describe your changes clearly in the pull request, explaining the problem and solution.

>### Reporting Issues

If you discover any issues or have suggestions for improvement, please open an issue. Provide a clear and concise description of the problem, steps to reproduce it, and any relevant information about your environment.

>### Support
If you like the project feel free to drop a star ✨. Your appreciation means a lot.

<p align="center" style="text-decoration: none;">Made by <a href="https://github.com/itzzzme" target="_blank">itzzzme 
</a>🫰</p>
