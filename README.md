# Description

Hotel booking API

`/src` - HOTEL API
`/remote-server` - Simulate remote server API (storage info about users vip status)

dont forget customize .env file for your local env!
`/.env`

`/remote-server/.env`

Tables and example data will be created automatically after connect to db

## Techologies

- **NestJS**
- **TypeScript**
- **PostgreSQL**
- **Sequelize** 
- **Express** — `remote-server`
- **React**


# Project setup
## Base

`Base API`
```bash
$ cd backend
$ npm install
```

`Remote API simulate`
```bash
$ cd backend/remote-server
$ npm install
```

`Frontend`
```bash
$ cd frontend/app
$ npm install
```

## Compile and run the project

`Base API`
```bash
$ cd backend
$ npm run start
```

`Remote API simulate`
```bash
$ cd remote-server
$ npm run start
```

`Frontend`
```bash
$ cd frontend/app
$ npm run dev
```