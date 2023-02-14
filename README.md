# bitcollector-bot

## Available scripts
`script - description`
- start - starts the built project in node
- build - builds the project with Typescript Compiler
- dev - starts the project for development with ts-node-dev
- lint - lints the project with eslint
- prettier - formats the project using prettier
- dev:imagegen - runs the imageGenerator.ts file inside src/utils/ with ts-node-dev for development
- deploy:global - registers your commands inside /build/src/commands directory with the Discord API using your .env client key and id
- deploy:dev - registers your commands inside /src/commands directory with the Discord API using your .env guild_id, and client key and id, this only deploys the commands for an single server (that is the GUILD_ID).

## For more information about the project and instructions on how to run it, see this repository
[bitcollector-about](https://github.com/Averagess/bitcollector-about)
