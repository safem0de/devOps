- create network then up container
```bash
docker network create shared-db
docker compose up -d
```

- make sure ว่า ไม่ชน
```bash
netstat -ano | findstr :5432
```