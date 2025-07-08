สร้าง Database และ User สำหรับ SonarQube (คลุมแล้ว run ทีละบรรทัด) ก่อนที่จะรัน docker-compose.yml
```bash
CREATE DATABASE sonarqube;
CREATE USER sonar WITH ENCRYPTED PASSWORD 'sonar';
GRANT ALL PRIVILEGES ON DATABASE sonarqube TO sonar;
```
WSL Setting
```bash
sudo sysctl -w vm.max_map_count=262144
```
user : myuser
pass : mypassword

สร้าง network shared-db ก่อน
```bash
nerdctl network create shared-db
```

Join Network
```bash
nerdctl network ls
```

SonarQube
user : admin
pass : admin
