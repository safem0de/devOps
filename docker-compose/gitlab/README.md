### SET SWAP (VOL-TO-MEMORY)
```bash
notepad "$env:USERPROFILE\.wslconfig"
```
```bash
[wsl2]
memory=6GB                  # จำกัด RAM สูงสุดให้ WSL2 ใช้ได้ (ปรับตามแรมเครื่อง)
processors=4                # จำนวน CPU core ที่ให้ใช้
swap=4GB                    # ขนาดไฟล์ swap (ช่วยกันแรมไม่พอ)
swapfile=D:\\wsl-swap.vhdx  # ที่เก็บไฟล์ swap
localhostForwarding=true    # ให้ forward localhost อัตโนมัติ
```

```bash
wsl --shutdown
```
เปิด wsl
```bash
free -h
```
               total        used        free      shared  buff/cache   available
Mem:           5.8Gi       257Mi       5.4Gi       2.0Mi       180Mi       5.3Gi
Swap:          4.0Gi          0B       4.0Gi

### Check ว่า มีใครใช้ port อะไรบ้าง
```bash
docker ps --format "table {{.Names}}\t{{.Ports}}"
```
### User/Password
```bash
user: root 
grep 'Password:' /etc/gitlab/initial_root_password
```
### ภาพรวม CI/CD แบบ DevOps
```bash
┌──────────────┐        ┌──────────────┐       ┌────────────────┐       ┌────────────────┐
│ Developer PC │  git→  │ GitLab Repo  │  CI→  │ GitLab Runner  │  CD→  │ Rancher / K8s  │
└──────────────┘        └──────────────┘       └────────────────┘       └────────────────┘
                             ↓ Docker push            ↑ pulls image          deploys app
                        ┌──────────────────────────────────────────────────────────────┐
                        │              Docker Registry (harbor/gitlab-registry)        │
                        └──────────────────────────────────────────────────────────────┘
```
### Goto Gitlab-runner
1. run docker compose
```bash
docker compose up -d
```
2. register gitlab runner
```bash
docker exec -it gitlab-runner gitlab-runner register
```
Enter the GitLab instance URL (for example, https://gitlab.com/):
```bash
http://host.docker.internal:8929
```