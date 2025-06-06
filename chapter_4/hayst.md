run these command to format perfectly the schema.prisma

```bash

```

then, run these to generate the database
Build your docker images

```bash

```

Create PostgreSQL migrations and apply them

```bash

```

_Also_ - to run/apply migrations if necessary:

```bash
docker-compose run app npx prisma migrate deploy
```

5. **Boot up 2x docker containers**:

```bash

```

_or_

```bash
docker compose up -d
```

If you want to boot it up without it commandeering your terminal (you'll have to stop if via Docker Desktop though).

6. **To login to docker PostgreSQL database (from a new terminal instance while docker containers are running) where you can run SQL commands and modify database!**:

```bash
docker exec -it postgres-db psql -U postgres -d todoapp
```

7. **To stop Docker containers**:

```bash
docker compose down
```

8. **To delete all docker containers**:

```bash
docker system prune

```
