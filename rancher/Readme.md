### Rancher Set Up
#### Step 1
```bash
docker ps
```
#### example
```bash
CONTAINER ID   IMAGE                    COMMAND                  CREATED          STATUS         PORTS                                      NAMES
61bde384ff8d   rancher/rancher:latest   "entrypoint.sh"          4 minutes ago    Up 4 minutes   0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp   rancher
570e4032f2c6   nginx                    "/docker-entrypoint.…"   46 minutes ago   Created        0.0.0.0:8080->80/tcp                       my-nginx
```

#### Step 2
```bash
docker docker logs container-id 2>&1 | findstr "Bootstrap Password:"
```

#### example
```bash
docker logs 61bde384ff8d 2>&1 | findstr "Bootstrap Password:"
```
