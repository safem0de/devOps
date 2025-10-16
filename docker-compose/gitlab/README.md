### สร้าง network (gitlab-net)
```bash
docker network create gitlab-net
```
- check gitlab-net
```bash
docker network inspect gitlab-net   # เห็นทั้ง gitlab และ gitlab-runner
```
- Test connect gitlab & gitlab-runner
```bash
docker run --rm -it --network gitlab-net busybox ping -c 3 gitlab
```
---
### ล้าง runner เดิมออก (กัน config เก่ารบกวน)
```bash
docker exec -it gitlab-runner gitlab-runner unregister --all-runners
```
---
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
---
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
* Enter the GitLab instance URL (for example, https://gitlab.com/):
```bash
http://host.docker.internal:8929
```
* Enter the registration token:
```bash
glrt-********************oxCw.01.120v8y2ws # your token
```
* Enter a description for the runner: 
```bash
docker-runner
```
* Enter tags for the runner (comma-separated):
```bash
docker
```
* Enter executor: 
```bash
docker
```
* Enter the default Docker image: 
```bash
docker:latest
```
docker exec -it gitlab-runner gitlab-runner list
---
### Self sign Certificate
```bash
cd docker-compose/git-registry/certs
openssl req -x509 -nodes -days 365 -newkey rsa:4096 \
  -keyout domain.key -out domain.crt \
  -config openssl-san.cnf -extensions v3_req
```
```bash
# 1️⃣ สร้างโฟลเดอร์ทั้งหมดให้ครบ
mkdir -p "/c/ProgramData/Docker/certs.d/host.docker.internal-5005"

# 2️⃣ คัดลอก cert ไปไว้ในนั้น
cp domain.crt "/c/ProgramData/Docker/certs.d/host.docker.internal-5005/ca.crt"
```
```bash
openssl x509 -in domain.crt -noout -subject -issuer -ext subjectAltName
```
result:
```bash
openssl x509 -in domain.crt -noout -subject -issuer -ext subjectAltName
subject=C=TH, ST=Bangkok, L=Bangkok, O=LocalRegistry, OU=DevOps, CN=host.docker.internal
issuer=C=TH, ST=Bangkok, L=Bangkok, O=LocalRegistry, OU=DevOps, CN=host.docker.internal
X509v3 Subject Alternative Name:
    DNS:host.docker.internal, DNS:secure-registry, DNS:localhost, IP Address:127.0.0.1
```
เพิ่ม Cert เข้าระบบ Windows trust store (Powershell Administrator)
```bash
certutil -addstore -f "Root" "C:\ProgramData\Docker\certs.d\host.docker.internal-5005\ca.crt"
```
result:
```bash
Root "Trusted Root Certification Authorities"
Signature matches Public Key
Certificate "host.docker.internal" added to store.
CertUtil: -addstore command completed successfully.
```
ติดตั้ง cert ใน container (เช่น gitlab-runner)
```bash
docker exec -it gitlab-runner sh -c "mkdir -p /usr/local/share/ca-certificates/extra"
docker cp domain.crt gitlab-runner:/usr/local/share/ca-certificates/extra/secure-registry.crt
docker exec -it gitlab-runner sh -c "update-ca-certificates"
```
```bash
docker exec -it gitlab-runner curl -v https://secure-registry:5000/v2/
curl -k https://localhost:5005/v2/
```
Add to Gitlab Variable (for ci)
```bash
cd docker-compose\git-registry\certs
cat domain.crt | base64 -w0
CA_CERT_BASE64 
```
---
### GitLab Variable
| ตัวแปร                  | ตัวอย่างค่า                            | ใช้ทำอะไร                                   |
| ---------------------- | ----------------------------------- | ------------------------------------------ |
| `CI_REGISTRY`          | `http://localhost:5005`             | URL ของ Container Registry                 |
| `CI_REGISTRY_IMAGE`    | `localhost:5005/root/test-pipeline` | path เต็มของ image ของโปรเจกต์นี้               |
| `CI_REGISTRY_USER`     | `gitlab-ci-token`                   | user พิเศษที่ GitLab ใช้ login อัตโนมัติ         |
| `CI_REGISTRY_PASSWORD` | `<auto-generated token>`            | password สำหรับ user ข้างบน                  |
| `CI_COMMIT_SHORT_SHA`  | `a1b2c3d4`                          | commit hash แบบสั้น ใช้แทน version tag ได้    |
---
#### ตํ้งค่า external_url (optional)
1. เข้าไปใน container GitLab
```bash
docker exec -it gitlab bash
```
2. เปิดไฟล์ config ของ GitLab
```bash
vi /etc/gitlab/gitlab.rb
```
3. หาและแก้บรรทัดนี้
```bash
# external_url 'GENERATED_EXTERNAL_URL'
เปลี่ยนเป็น
external_url 'http://gitlab:8929'
```
4. “ค้นหา” ข้อความใน vi / vim 
- กด / ตามด้วยคำที่อยากหา แล้ว Enter
```bash
/external_url
```
⏭ ไปยังคำต่อไป: กด n (ตัวเล็ก)
⏮ กลับไปคำก่อนหน้า: กด N (ตัวใหญ่)
5. จากนั้นกด i เพื่อ เข้าโหมดแก้ไข (insert mode)
6. เสร็จแล้วกด: Esc
7. เพื่อบันทึกและออกจาก vi, พิมพ์:
```bash
:wq
```
8. ตรวจสอบความถูกต้อง
```bash
grep "external_url" /etc/gitlab/gitlab.rb
```
ควรเห็นแบบนี้: external_url 'http://gitlab:8929'
9. ใน gitlab container > apply config ใหม่
```bash
gitlab-ctl reconfigure
gitlab-ctl restart
```
10. restart docker
```bash
docker restart gitlab
```