### Basic Git
```bash
cd D:\Projects\devOps\docker-compose\gitlab\test-pipeline
```
สร้าง repo git ใหม่
```bash
git init
```
# เพิ่มไฟล์ทั้งหมด
```bash
git add .
```
# commit ครั้งแรก
```bash
git commit -m "Initial commit for test-pipeline"
```
# เชื่อมกับ remote repository (เปลี่ยน URL ให้เป็นของคุณ)
```bash
git remote add origin http://localhost:8929/root/test-pipeline.git
```
# push ขึ้น branch main
```bash
git branch -M main
git push -u origin main
```

### Addition details for config.toml
```bash
[[runners]]
  name = "docker-runner"
  url = "http://gitlab:8929/" # URL สำหรับ register ยังคงใช้ gitlab
  token = "xxxxxxxxxxxx"
  executor = "docker"
  clone_url = "http://gitlab:8929" # <--- เพิ่มบรรทัดนี้เข้าไป
  [runners.docker]
    tls_verify = false
    image = "docker:latest"
    privileged = false # <--- เปลี่ยนเป็น true
    disable_entrypoint_overwrite = false
    oom_kill_disable = false
    disable_cache = false
    volumes = ["/cache"]
    shm_size = 0
    network_mode = "gitlab-net" # <--- เพิ่มบรรทัดนี้เข้าไป
```
restart after set config
```bash
docker restart gitlab-runner
```