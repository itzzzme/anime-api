<div align="center">

![Static Badge](https://img.shields.io/badge/node.js-grey?logo=nodedotjs) ![GitHub stars](https://img.shields.io/github/stars/itzzzme/anime-api?logo=github)
![GitHub forks](https://img.shields.io/github/forks/itzzzme/anime-api?logo=github)
![Static Badge](https://img.shields.io/badge/version-1.0.0-blue)

</div>

## <span>Disclaimer</span>

1.  This `api` does not store any files , it only link to the media which is hosted on 3rd party services.

2.  This `api` is explicitly made for educational purposes only and not for commercial usage. This repo will not be responsible for any misuse of it.

<p align="center">
      <img
        src="./public/anya.gif"
        width="200"
        height="200"
      />
    </p>

# <p align="center">Anime API</p>

>

<p align="center">RestFul API made with Node.js <br/>(Checkout this anime streaming website  <a href="https://zenime.site" tarGET="_blank">Zenime</a> powered by this API)</p>

> <h2> Table of Contents </h2>

- [Installation](#installation)
  - [Local installation](#local-installation)
- [Deployment](#deployment)
  - [Vercel](#Vercel)
  - [Render](#Render)
- [Documentation](#documentation)
  - [GET Home Info](#get-home-info)
  - [GET Top 10 Anime's Info](#get-top-10-animes-info)
  - [GET Specified Anime's Info](#get-specified-animes-info)
  - [GET Random Anime's Info](#get-random-animes-info)
  - [GET Categories Info](#get-categories-info)
  - [GET Producer's & studio's Anime](#get-anime-of-specific-producers-or-studio)
  - [GET Search Result's Info](#get-search-results-info)
  - [GET Search Suggestions](#get-search-suggestions)
  - [GET Anime Schedule](#get-schedule-of-upcoming-anime)
  - [GET Anime's Next Epiosde's Schedule](#get-schedule-of-next-episode-of-anime)
  - [GET Anime Qtip Info](#get-qtip-info)
  - [GET Anime Characters](#get-characters)
  - [GET Character Details](#get-character-details)
  - [GET Voice Actor Details](#get-voice-actor-details)
  - [GET Anime Stream Info](#get-streaming-info)
  - [GET Anime Episodes](#get-animes-episode-list)
  - [GET Anime Episode's Available Servers](#get-available-servers-of-anime)
- [Pull Requests](#pull-requests)
- [Reporting Issues](#reporting-issues)
- [Support](#support)

> # Installation

## Local installation

Make sure you have node installed on your device

1. Run the following code to clone the repository and install all required dependencies

```bash
$ git clone https://github.com/itzzzme/anime-api.git
$ cd anime-api
$ npm install
```

2. Refer the [.env.example](https://github.com/itzzzme/anime-api/blob/main/.env.example) file to setup `.env` file

```bash
# Origins you want to allow

ALLOWED_ORIGIN=<https://site1.com>,<https://site2.com>,...
```

3. Start the server

```bash
$ npm start #or npm run devStart
```

> # Deployment

### Vercel

Host your own instance of anime-api on vercel

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/itzzzme/anime-api)

### Render

Host your own instance of anime-api on Render.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/itzzzme/anime-api)

> # Documentation

### `GET` Home info

```bash
  GET /api/
```

### Endpoint

```bash
  /api/
```

> #### No parameter required ❌

#### Example of request

```javascript
import axios from "axios";
const resp = await axios.get("/api/");
console.log(resp.data);
```

#### Sample Response

```javascript
{
  "success": true,
  "results": {
    "spotlights": [
      {
        "id":string,
        "data_id": number,
        "poster": string,
        "title": string,
        "japanese_title": string,
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
        "id":string,
        "data_id": number,
        "number": number,
        "poster": string,
        "title": string,
        "japanese_title": string,
      }
      {...}
    ],
    "today":[
      "schedule":[
        {
          "id":string,
          "data_id":number,
          "title":string,
          "japanese_title":string,
          "releaseDate":string,
          "time":string,
          "episode_no":number,
        },{...}
      ]
    ],
    "topAiring":[
      {
        "id":string,
        "data_id":number,
        "poster":string,
        "title":string,
        "japanese_title":string,
        "description":string,
        tvInfo:[object]
      }
    ],
    "mostPopular":[
      {
        "id":string,
        "data_id":number,
        "poster":string,
        "title":string,
        "japanese_title":string,
        "description":string,
        tvInfo:[object]
      },
    "mostFavorite":[
      {
        "id":string,
        "data_id":number,
        "poster":string,
        "title":string,
        "japanese_title":string,
        "description":string,
        tvInfo:[object]
      }
    ],
    "latestCompleted":[
      {
        "id":string,
        "data_id":number,
        "poster":string,
        "title":string,
        "japanese_title":string,
        "description":string,
        tvInfo:[object]
      }
    ],
    "latestEpisode":[
      {
        "id":string,
        "data_id":number,
        "poster":string,
        "title":string,
        "japanese_title":string,
        "description":string,
        tvInfo:[object]
      }
    ],
    "genres":[
      string,
      string,
      string,
      ...
    ]
  }
}
```

### `GET` Top 10 anime's info

```bash
  GET /api/top-ten
```

### Endpoint

```bash
  /api/top-ten
```

> #### No parameter required ❌

#### Example of request

```javascript
import axios from "axios";
const resp = await axios.get("/api/top-ten");
console.log(resp.data);
```

#### Sample Response

```javascript
{
  "success": true,
  "results": [
    "topTen":[
      "today":[
        {
          "id":string,
          "data_id": number,
          "number": number,
          "name": string,
          "poster": string,
          "tvInfo": [Object]
        },
        {...}
      ],
      "week":[
        {
          "id":string,
          "data_id": number,
          "number": number,
          "name": string,
          "poster": string,
          "tvInfo": [Object]
        },
        {...}
      ],
      "month":[
        {
          "id":string,
          "data_id": number,
          "number": number,
          "name": string,
          "poster": string,
          "tvInfo": [Object]
        },
        {...}
      ],
    ]
  ]
}
```

### `GET` Specified anime's info

```bash
  GET /api/info
```

### Endpoint

```bash
  /api/info?id={string}
```

#### Parameters

| Parameter | Parameter-Type | Data-Type | Description | Mandatory ? | Default |
| :-------: | :------------: | :-------: | :---------: | :---------: | :-----: |
|   `id`    |    `query`     |  string   |  anime-id   |   Yes ✔️    |   --    |

#### Example of request

```javascript
import axios from "axios";
const resp = await axios.get("/api/info?id=yami-shibai-9-17879");
console.log(resp.data);
```

#### Sample Response

```javascript
{
  "success": true,
  "results": {
    "data": {
      "adultContent":boolean,
      "id":string,
      "data_id": number,
      "title": string,
      "japanese_title": string,
      "poster": string,
      "showType":string,
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
    },
    "seasons": [
      {
        "id":string,
        "data_number": number,
        "data_id": number,
        "season": string,
        "title": string,
        "japanese_title": string,
        "season_poster": string
      },
      {...}
    ],

  }
}
```

### `GET` Random anime's info

```bash
  GET /api/random
```

### Endpoint

```bash
  /api/random
```

#### Example of request

```javascript
import axios from "axios";
const resp = await axios.get("/api/random");
console.log(resp.data);
```

#### Sample Response

```javascript
{
  "success": true,
  "results": {
    "data": {
      "adultContent":boolean,
      "id":string,
      "data_id": number,
      "title": string,
      "japanese_title": string,
      "poster": string,
      "showType":string,
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
    },
    "related_data":[
      [
       {
          "duration": "string",
          "data_id": "number",
          "id": "string",
          "title": "string",
          "japanese_title": "string",
          "poster": "string",
          "tvInfo": {
              "dub": "number",
              "sub": "number",
              "showType": "string",
              "eps": "number"
            }
        },{...}
      ]
    ],
    "recommended_data":[
      [
       {
          "duration": "string",
          "data_id": "number",
          "id": "string",
          "title": "string",
          "japanese_title": "string",
          "poster": "string",
          "tvInfo": {
              "dub": "number",
              "sub": "number",
              "showType": "string",
              "eps": "number"
            }
        },{...}
      ]
    ],
    "seasons": [
      {
        "id":string,
        "data_number": number,
        "data_id": number,
        "season": string,
        "title": string,
        "japanese_title": string,
        "season_poster": string
      },
      {...}
    ],

  }
}
```

### `GET` Categories info

```bash
  GET /api/<category>
```

### Endpoint

```bash
  /api/{string}?page={number}
  #or
  /api/{string}
```

#### Parameters

| Parameter  | Parameter-Type | Data-Type | Description | Mandatory ? | Default |
| :--------: | :------------: | :-------: | :---------: | :---------: | :-----: |
| `category` |     `path`     | `string`  | `Category`  |   Yes ✔️    |   --    |
|   `page`   |    `query`     | `number`  | `Page-no.`  |    No ❌    |   `1`   |

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
- genre/action
- genre/adventure
- genre/cars
- genre/comedy
- genre/dementia
- genre/demons
- genre/drama
- genre/ecchi
- genre/fantasy
- genre/game
- genre/harem
- genre/historical
- genre/horror
- genre/isekai
- genre/josei
- genre/kids
- genre/magic
- genre/martial-arts
- genre/mecha
- genre/military
- genre/music
- genre/mystery
- genre/parody
- genre/police
- genre/psychological
- genre/romance
- genre/samurai
- genre/school
- genre/sci-fi
- genre/seinen
- genre/shoujo
- genre/shoujo-ai
- genre/shounen
- genre/shounen-ai
- genre/slice-of-life
- genre/space
- genre/sports
- genre/super-power
- genre/supernatural
- genre/thriller
- genre/vampire
- az-list
- az-list/other
- az-list/0-9
- az-list/a
- az-list/b
- az-list/c
- az-list/d
- az-list/e
- az-list/f
- az-list/g
- az-list/h
- az-list/i
- az-list/j
- az-list/k
- az-list/l
- az-list/m
- az-list/n
- az-list/o
- az-list/p
- az-list/q
- az-list/r
- az-list/s
- az-list/t
- az-list/u
- az-list/v
- az-list/w
- az-list/x
- az-list/y
- az-list/z
- movie
- special
- ova
- ona
- tv

#### Example of request

```javascript
import axios from "axios";
const resp = await axios.get("/api/most-popular?page=1");
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
        "id":string,
        "data_id": number,
        "poster": string,
        "title": string,
        "japanese_title": string,
        "description": string,
        "tvInfo": {
          "showType": string,
          "duration": string,
          "sub": number,
          "dub": number
        },
        "adultContent":boolean,
      },
      {
        "id":string,
        "data_id": number,
        "poster": string,
        "title": string,
        "japanese_title": string,
        "description": string,
        "tvInfo": {
          "showType": sting,
          "duration": string,
          "sub": number,
          "dub": number,
          "eps": number
        },
        "adultContent":boolean,
      },
      {...}
    ],
    "totalPages":number
  }
}
```

### `GET` Anime of specific producers or studio

```bash
  GET /api/<producer>/
```

### Endpoint

```bash
  /api/producer/{string}?page={number}
  #or
  /api/producer/{string}
```

#### Parameters

| Parameter  | Parameter-Type | Data-Type | Description | Mandatory ? | Default |
| :--------: | :------------: | :-------: | :---------: | :---------: | :-----: |
| `producer` |     `path`     | `string`  | `Producer`  |   Yes ✔️    |   --    |
|   `page`   |    `query`     | `number`  | `Page-no.`  |    No ❌    |   `1`   |

#### Example of request

```javascript
import axios from "axios";
const resp = await axios.get("/api/producer/ufotable?page=1");
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
        "id":string,
        "data_id": number,
        "poster": string,
        "title": string,
        "japanese_title": string,
        "description": string,
        "tvInfo": {
          "showType": string,
          "duration": string,
          "sub": number,
          "dub": number
        },
        "adultContent":boolean,
      },
      {
        "id":string,
        "data_id": number,
        "poster": string,
        "title": string,
        "japanese_title": string,
        "description": string,
        "tvInfo": {
          "showType": sting,
          "duration": string,
          "sub": number,
          "dub": number,
          "eps": number
        },
        "adultContent":boolean,
      },
      {...}
    ],
    "totalPages":number
  }
}
```

### `GET` Search result's info

```bash
  GET /api/search
```

### Endpoint

```bash
  /api/search?keyword={string}
```

#### Parameters

| Parameter | Parameter-Type |   Type   | Description | Mandatory ? | Default |
| :-------: | :------------: | :------: | :---------: | :---------: | :-----: |
| `keyword` |    `query`     | `string` |  `keyword`  |   Yes ✔️    |   --    |

#### Example of request

```javascript
import axios from "axios";
const resp = await axios.get("/api/search?keyword=one%20punch%20man");
console.log(resp.data);
```

#### Sample Response

```javascript
{
  "success": true,
  "results": [
    {
        "id":string,
        "data_id": number,
        "poster": string,
        "title": string,
        "japanese_title": string,
        "tvInfo": [Object]
      },
    {
        "id":string,
        "data_id": number,
        "poster": string,
        "title": string,
        "japanese_title": string,
        "tvInfo": [Object]
      },
    {...}
  ]
}
```

### `GET` Search suggestions

```bash
  GET /api/search/suggest
```

### Endpoint

```bash
  /api/search/suggest?keyword={string}
```

#### Parameters

| Parameter | Parameter-Type |   Type   | Description | Mandatory ? | Default |
| :-------: | :------------: | :------: | :---------: | :---------: | :-----: |
| `keyword` |    `query`     | `string` |  `keyword`  |   Yes ✔️    |   --    |

#### Example of request

```javascript
import axios from "axios";
const resp = await axios.get("/api/search/suggest?keyword=demon");
console.log(resp.data);
```

#### Sample Response

```javascript
{
  "success": true,
  "results": [
    {
        "id":"string",
        "data_id": number,
        "poster": string,
        "title": string,
        "japanese_title": string,
        "releaseDate": string,
        "showType": string,
        "duration": string,
      },
    {
        "id":"string",
        "data_id": number,
        "poster": string,
        "title": string,
        "japanese_title": string,
        "releaseDate": string,
        "showType": string,
        "duration": string,
      },
    {...}
  ]
}
```

### `GET` Anime's episode list

```bash
  GET /api/episodes/
```

### Endpoint

```bash
  /api/episodes/{param}
```

#### Parameters

| Parameter-Type | Data-Type | Description | Mandatory ? | Default |
| :------------: | :-------: | :---------: | :---------: | :-----: |
|    `param`     |  string   |  anime-id   |   Yes ✔️    |   --    |

#### Example of request

```javascript
import axios from "axios";
const resp = await axios.get("/api/episodes/one-piece-100");
console.log(resp.data);
```

#### Sample Response

```javascript
{
  "success": true,
  "results": [
    "totalEpisodes":number,
    "episodes":[
    { "episode_no": number,
      "id": string,
      "data_id": number,
      "jname": string,
      "title": string,
      "japanese_title": string
    },
    {...}
    ]
  ]
}
```

### `GET` Schedule of upcoming anime

```bash
  GET /api/schedule
```

### Endpoint

```bash
  /api/schedule?date={string}
```

#### Parameters

| Parameter | Parameter-Type | Data-Type | Description | Mandatory ? | Default |
| :-------: | :------------: | :-------: | :---------: | :---------: | :-----: |
|  `date`   |     query      |  string   |    date     |   Yes ✔️    |   --    |

#### Example of request

```javascript
import axios from "axios";
const resp = await axios.get("/api/schedule?date=2024-09-23");
console.log(resp.data);
```

#### Sample Response

```javascript
{
  "success": true,
  "results": [
    {
      "id":string,
      "data_id":number,
      "title":string,
      "japanese_title":string,
      "releaseDate":string,
      "time":string,
      "episode_no":number
    },
    {...}
  ]
}
```

### `GET` Schedule of next episode of Anime

```bash
  GET /api/schedule/
```

### Endpoint

```bash
  /api/schedule/:id
```

#### Parameters

| Parameter | Parameter-Type | Data-Type | Description | Mandatory ? | Default |
| :-------: | :------------: | :-------: | :---------: | :---------: | :-----: |
|   `id`    |     param      |  string   |  anime-id   |   Yes ✔️    |   --    |

#### Example of request

```javascript
import axios from "axios";
const resp = await axios.get("/api/schedule/one-piece-100");
console.log(resp.data);
```

#### Sample Response

```javascript
{
  "success":true,
  "results":
  {
    "nextEpisodeSchedule":"2025-02-08 16:30:00"
  }
}
```

### `GET` Qtip info

```bash
   GET /api/qtip/
```

### Endpoint

```bash
   /api/qtip/{id}
```

#### Parameters

| Parameter | Data-Type | Description | Mandatory ? | Default |
| :-------: | :-------: | :---------: | :---------: | :-----: |
|  `param`  | `number`  |     id      |   Yes ✔️    | Yes ✔️  |

#### Example of request

```javascript
import axios from "axios";
const resp = await axios.get("/api/qtip/3365");
console.log(resp.data);
```

#### Sample Response

```javascript
{
  "success": true,
  "results": {
    "title": string,
    "rating": double,
    "quality": string,
    "subCount": number,
    "dubCount": number,
    "episodeCount": number,
    "type": string,
    "description": string,
    "japaneseTitle": string,
    "Synonyms": string,
    "airedDate": string,
    "status": string,
    "genres": [Object],
    "watchLink": string
  }
}
```

### `GET` Characters

```bash
   GET /api/character/list/
```

### Endpoint

```bash
   /api/character/list/{id}
```

#### Parameters

| Parameter-Type | Data-Type | Description | Mandatory ? | Default |
| :------------: | :-------: | :---------: | :---------: | :-----: |
|    `param`     | `string`  |  anime-id   |   Yes ✔️    | Yes ✔️  |

#### Example of request

```javascript
import axios from "axios";
const resp = await axios.get("/api/character/list/one-piece-100");
console.log(resp.data);
```

#### Sample Response

```javascript
{
  "success": true,
  "results": {
    "currentPage": number,
    "totalPages": number,
    "data": [
      {
        "character": {
          "id": string,
          "poster": string,
          "name": string,
          "cast": string
        },
        "voiceActors": [
          {
            "id": string,
            "poster": string,
            "name": string
          },
          {
            "id": string,
            "poster": string,
            "name": string
          },
          {...}
        ]
      },{...}
    ]
  }
}

```

### `GET` Streaming info

```bash
  GET /api/stream
```

### Endpoint

```bash
  /api/stream?id={string}&server={string}&type={string}
```

#### Parameters

|        Parameters        | Parameter-Type |   Type   | Description | Mandatory ? | Default |
| :----------------------: | :------------: | :------: | :---------: | :---------: | :-----: |
| `id` , `server` , `type` |    `query`     | `string` |  `keyword`  |   Yes ✔️    |   --    |

#### Example of request

```javascript
import axios from "axios";
const resp = await axios.get(
  "/api/stream?id=frieren-beyond-journeys-end-18542?ep=107257&server=hd-1&type=sub"
);
console.log(resp.data);
```

#### Sample Response

```javascript
{
  "success": true,
  "results": {
    "streamingLink": [
      {
            "id":number,
            "type": "sub",
            "link": {
              "file":string,
              "type":string,
            },
            "tracks": [
              {
                "file": string,
                "label": string,
                "kind": string,
                "default": boolean
              },{...}
            ],
            "intro": [Object],
            "outro": [Object],
            "server":string
      }
    ],
    "servers": [
      {
        "type":string,
        "data_id": number,
        "server_id": number,
        "server_name": string
      },
      {...}
    ]
  }
}
```

### `GET` Available servers of anime

```bash
  GET /api/servers/
```

### Endpoint

```bash
  /api/servers/{id}
```

#### Parameters

| Parameter-Type | Data-Type | Description | Mandatory ? | Default |
| :------------: | :-------: | :---------: | :---------: | :-----: |
|    `params`    | `string`  |  `keyword`  |   Yes ✔️    |   --    |

#### Example of request

```javascript
import axios from "axios";
const resp = await axios.get(
  "/api/servers/demon-slayer-kimetsu-no-yaiba-hashira-training-arc-19107?ep=124260"
);
console.log(resp.data);
```

#### Sample Response

```javascript
{
  "success": true,
  "results": [
    {
      "type": string,
      "data_id": number,
      "server_id": number,
      "serverName": string
    },
    {...},
  ]
}
```

### `GET` Character Details

```bash
  GET /api/character/
```

### Endpoint

```bash
  /api/character/{id}
```

#### Parameters

| Parameter-Type | Data-Type | Description | Mandatory ? | Default |
| :------------: | :-------: | :---------: | :---------: | :-----: |
|    `params`    | `string`  | character-id|   Yes ✔️    |   --    |

#### Example of request

```javascript
import axios from "axios";
const resp = await axios.get("/api/character/asta-340");
console.log(resp.data);
```

#### Sample Response

```javascript
{
  "success": true,
  "results": {
    "data": [{
      "id": "asta-340",
      "name": "Asta",
      "profile": "https://cdn.noitatnemucod.net/thumbnail/400x400/100/945515d313d02fdcd33be3085512c550.jpg",
      "japaneseName": "アスタ",
      "about": {
        "description": "Asta is the main protagonist of Black Clover...",
        "style": "<p>Asta is the main protagonist of Black Clover...</p>"
      },
      "voiceActors": [
        {
          "name": "Kajiwara, Gakuto",
          "profile": "https://example.com/profile.jpg",
          "language": "Japanese",
          "id": "gakuto-kajiwara-534"
        },
        {
          "name": "Dallas Reid",
          "profile": "https://example.com/profile2.jpg",
          "language": "English",
          "id": "dallas-reid-892"
        }
      ],
      "animeography": [
        {
          "title": "Black Clover",
          "id": "2404",
          "role": "Main",
          "type": "TV",
          "poster": "https://example.com/poster.jpg"
        },
        {
          "title": "Black Clover: Sword of the Wizard King",
          "id": "2405",
          "role": "Main",
          "type": "Movie",
          "poster": "https://example.com/poster2.jpg"
        }
      ]
    }]
  }
}
```


### `GET` Voice Actor Details

```bash
  GET /api/actors/
```

### Endpoint

```bash
  /api/actors/{id}
```

#### Parameters

| Parameter-Type | Data-Type | Description | Mandatory ? | Default |
| :------------: | :-------: | :---------: | :---------: | :-----: |
|    `params`    | `string`  | voice-actor-id|   Yes ✔️    |   --    |

#### Example of request

```javascript
import axios from "axios";
const resp = await axios.get("/api/actors/gakuto-kajiwara-534");
console.log(resp.data);
```

#### Sample Response

```javascript
{
  "success": true,
  "results": {
    "data": [{
      "id": "gakuto-kajiwara-534",
      "name": "Kajiwara, Gakuto",
      "profile": "https://cdn.noitatnemucod.net/thumbnail/400x400/100/945515d313d02fdcd33be3085512c550.jpg",
      "japaneseName": "梶原岳人",
      "about": {
        "description": "Kajiwara Gakuto is a Japanese voice actor...",
        "style": "<p>Kajiwara Gakuto is a Japanese voice actor...</p>"
      },
      "roles": [
        {
          "anime": {
            "title": "Black Clover",
            "poster": "https://example.com/poster.jpg",
            "type": "TV",
            "year": "2017",
            "id": "black-clover"
          },
          "character": {
            "name": "Asta",
            "profile": "https://example.com/asta.jpg",
            "role": "Main"
          }
        },
        // ... more roles ...
      ]
    }]
  }
}
```


> ### Pull Requests

- Pull requests are welcomed that address bug fixes, improvements, or new features.
- Fork the repository and create a new branch for your changes.
- Ensure your code follows our coding standards.
- Include tests if applicable.
- Describe your changes clearly in the pull request, explaining the problem and solution.

> ### Reporting Issues

If you discover any issues or have suggestions for improvement, please open an issue. Provide a clear and concise description of the problem, steps to reproduce it, and any relevant information about your environment.

> ### Support
>
> If you like the project feel free to drop a star ✨. Your appreciation means a lot.

<p align="center" style="text-decoration: none;">Made by <a href="https://github.com/itzzzme" tarGET="_blank">itzzzme 
</a>🫰</p>
