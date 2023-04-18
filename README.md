# nexus-prisma-api

### Install MYSQL docker
```
docker run --name nexus-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password -d mysql
```

### Install Dependencies
```
yarn install
```

### Run database migrations
```
npx prisma migrate dev --name init
```