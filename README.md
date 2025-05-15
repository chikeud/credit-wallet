# LendSqr Demo-Credit Assessment

Ensure SQL Server is running locally

Migrate & Seed DB:
```bash
npx knex migrate:make create_users
npx knex migrate:make create_wallets
```

then copy my sample migration files  
into the new ones. And run

```bash
npx knex migrate:latest
```
Then seed the DB by running: 

```bash
npx knex seed:run
```

Clone repo and run 
```bash
npm install
```

Ensure you have a .env file for db and connection.
e.g:

```bash
DB_HOST=127.0.0.1
DB_NAME=demo_credit
DB_PASS=new_password
DB_USER=root
```

To spin API server up run:

```bash
npm run dev
```

To run tests:
```bash
npm run test
```
