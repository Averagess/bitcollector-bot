# BitCollector-Bot

Responsible for interacting with Discord API and our express backend.
Updates player data and provides players with information about their account statistics.


# How to run
Clone both the server and bot from github, after that build both Dockerfiles from the server and this directory.
Then make an docker-compose.yaml file at the root of both directory.
The docker-compose file runs both the server and bot with docker compose.

How the directory should look:
* bitcollector-bot (this directory)
* bitcollector-server (backend directory)
* docker-compose.yaml

docker-compose.yml contents (remember to replace values surrounded with <> to correct values):
```Dockerfile
services:
  bot:
    image: bitcollector-bot
    depends_on:
      [ backend ]
    build:
      context: ./bitcollector-bot
      dockerfile: Dockerfile
    environment:
      [ 
        DISCORD_TOKEN=<BOT DISCORD TOKEN>,
        GUILD_ID=<GUILD_ID FOR TESTING>,
        CLIENT_ID=<DISCORD APPLICATIONS CLIENT ID>,
        BACKEND_URL=http://backend:3000,
        APIKEY=<APIKEY FOR BACKEND>,
        NODE_ENV=<PRODUCTION | DEVELOPMENT>
      ]
    volumes:
      [ ./:/src/bot ]
    container_name: discordbot
  backend:
    image: bitcollector-server
    build:
      context: ./bitcollector-server
      dockerfile: Dockerfile
    environment:
      - PORT=3000
      - MONGODB_URI=<URI FOR MONGODB>
      - NODE_ENV=<PRODUCTION | DEVELOPMENT>
    volumes:
      - ./:/src/server
    ports: 
      - 127.0.0.1:4000:3000
    container_name: backend
```