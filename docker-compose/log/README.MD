📁 โครงสร้างโฟลเดอร์
```bash
project-root/
├── docker-compose.yml
├── frontend-test-scenario/
│   ├── Dockerfile
│   └── ... (Angular app)
├── backend-test-scenario/
│   ├── Dockerfile
│   └── ... (C# API)
├── loki/
│   └── loki-config.yml
├── grafana/
│   └── provisioning/
│       ├── datasources/
│       │   └── loki.yml
│       └── dashboards/
│           └── default.yml
└── promtail/
    ├── promtail-frontend.yml
    └── promtail-backend.yml
```
```bash
Grafana:   http://localhost:3000 (admin/admin)
Frontend:  http://localhost:4200
Backend:   http://localhost:5160/api
Loki:      http://localhost:3100
Postgres:  localhost:5432
```

# Build และ start ทั้งหมด
```bash
docker-compose up -d
```

# ดู logs เฉพาะ service
```bash
docker-compose logs -f grafana
docker-compose logs -f loki
docker-compose logs -f frontend
docker-compose logs -f backend
```

### Frontend Logs
```bash
{app="angular-frontend"} |= "error"
```

### Backend Logs
```bash
{app="backend-api"} |= "error"
```