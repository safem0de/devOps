```bash
          (UI / API / Triggers)
                ┌───────────┐
Webhook/Cron -->│ n8n Main   │
                └─────┬─────┘
                      │  enqueue job
                      v
                ┌───────────┐
                │   Redis   │  (queue/broker)
                └─────┬─────┘
                      │  workers pull jobs
          ┌───────────┴───────────┐
          v                       v
   ┌─────────────┐        ┌─────────────┐
   │ n8n Worker 1 │  ...   │ n8n Worker N │
   └──────┬──────┘        └──────┬──────┘
          │ execute workflows           │
          └───────────┬───────────────┘
                      v
                ┌───────────┐
                │ Postgres  │ (executions, creds, etc.)
                └───────────┘
```

รัน 1 main + 3 workers:
```bash
docker compose up -d --scale n8n-worker=3
```