<center><h1>Webverse Backend API</h1></center>

<h3>Folder Structure</h3>

- `src` - entry folder
- `src/index.js` - entry file
- `src/router/router.js` - main router linking all sub-routes
- `src/router/**/exampleRouter.js` - "/example" route linked in main router
- `src/db.js` - global prisma instance
- `env.js` - env (please add in .env then export a const from here to access everywhere)
- `Dockerfile` - to dockerize the server
- `nodemon.json` - nodemon config
- `version.txt` - env versions
- `prisma/schema.prisma` - prisma schema file
- `prisma/dev.db` - sqlite database

<br/>
<h3>Scripts</h3>

- `npm run dev` - run in development mode
- `npm run start` - run in production mode
- `npx prisma generate` - generate prisma client
- `npx prisma db push` - push changes to database