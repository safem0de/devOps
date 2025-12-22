```bash
┌───────────────────────────────┐
│           Internet            │
└───────────────┬───────────────┘
                │ 80 / 443
                ▼
┌───────────────────────────────┐
│   Nginx Proxy Manager (Docker)│
│  - TLS Termination (LE)       │
│  - Host-based Routing         │
│                               │
│  rancher.borneothai.com       │
│  directus.borneothai.com      │
│  app.borneothai.com           │
│  n8n.borneothai.com           │
└───────────────┬───────────────┘
                │ (HTTP / HTTPS)
                ▼
┌────────────────────────────────────────────────┐
│                    VM (Ubuntu)                 │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │                k3s (Kubernetes)           │ │
│  │  (Traefik disabled)                       │ │
│  │                                          │ │
│  │  ┌──────────────┐   ┌─────────────────┐ │ │
│  │  │   Rancher    │   │     Argo CD      │ │ │
│  │  │ (NodePort)  │   │   (GitOps CD)    │ │ │
│  │  └──────────────┘   └─────────────────┘ │ │
│  │                                          │ │
│  │  ┌──────────────┐   ┌─────────────────┐ │ │
│  │  │  Directus    │   │    Next.js      │ │ │
│  │  │ (API/CMS)   │   │   (Frontend)    │ │ │
│  │  └──────────────┘   └─────────────────┘ │ │
│  │                                          │ │
│  │  ┌──────────────┐   ┌─────────────────┐ │ │
│  │  │     n8n      │   │  Redis / Rabbit │ │ │
│  │  │ (Workflow)  │   │   (Queue/Cache) │ │ │
│  │  └──────────────┘   └─────────────────┘ │ │
│  │                                          │ │
│  │  ┌────────────────────────────────────┐ │ │
│  │  │           PgBouncer                │ │ │
│  │  │   (Connection Pooling)             │ │ │
│  │  └─────────────────┬──────────────────┘ │ │
│  │                    │                    │ │
│  │  ┌─────────────────▼──────────────────┐ │ │
│  │  │            PostgreSQL               │ │ │
│  │  │     (StatefulSet + local-path PV)  │ │ │
│  │  └────────────────────────────────────┘ │ │
│  │                                          │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  Docker (outside k3s):                         │
│  - Nginx Proxy Manager                         │
│  - (Keycloak / legacy services – optional)    │
└────────────────────────────────────────────────┘
```

```bash
User
 └─▶ DNS (borneothai.com)
      └─▶ Nginx Proxy Manager (443)
           └─▶ NodePort (k3s)
                └─▶ Service (ClusterIP)
                     └─▶ Pod
```