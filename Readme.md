### folders structure
```bash
DevOps-Lab/
├── gitlab/
│   ├── Dockerfile
│   ├── docker-compose.yml
├── gitlab-runner/
│   ├── Dockerfile
│   ├── docker-compose.yml
├── rancher/
│   ├── Dockerfile
│   ├── docker-compose.yml
├── kong/
│   ├── Dockerfile
│   ├── docker-compose.yml
├── prometheus/
│   ├── Dockerfile
│   ├── docker-compose.yml
├── grafana/
│   ├── Dockerfile
│   ├── docker-compose.yml
├── docker-compose.yml
```

### create folders
```bash
mkdir gitlab
type nul > gitlab/Dockerfile
type nul > gitlab/docker-compose.yml

mkdir gitlab-runner
type nul > gitlab-runner/Dockerfile
type nul > gitlab-runner/docker-compose.yml

mkdir rancher
type nul > rancher/Dockerfile
type nul > rancher/docker-compose.yml

mkdir kong
type nul > kong/Dockerfile
type nul > kong/docker-compose.yml

mkdir prometheus
type nul > prometheus/Dockerfile
type nul > prometheus/docker-compose.yml

mkdir grafana
type nul > grafana/Dockerfile
type nul > grafana/docker-compose.yml
```

### docker command
```bash
docker system prune
```

```bash
docker --version
docker-compose --version
```

log analyse
```bash
docker logs -f gitlab | more
docker logs gitlab > gitlab_log.txt
docker logs gitlab | findstr /i "error fail" > gitlab_log.txt
```

## 0. รันไฟล์กลาง
Detached Mode
```bash
docker compose up -d
```

## 1. เข้าสู่ Container GitLab
ให้คุณรันคำสั่งเพื่อเข้าไปยัง container GitLab ที่กำลังรันอยู่:
```bash
docker ps
```

```bash
docker exec -it gitlab /bin/bash
```

## 2. รีเซ็ตรหัสผ่านบัญชี Administrator
เมื่ออยู่ใน container GitLab แล้ว ให้ใช้คำสั่ง gitlab-rails console เพื่อรีเซ็ตรหัสผ่านแอดมิน:

```bash
gitlab-rails console
```

รันคำสั่งต่อไปนี้ใน Rails console:
```bash
user = User.find_by(username: 'root')
user.password = 'your_new_password'
user.password_confirmation = 'your_new_password'
user.save!
```

เปลี่ยน 'your_new_password' เป็นรหัสผ่านใหม่ที่คุณต้องการสำหรับบัญชี root (Administrator)

## 3. เข้าสู่ระบบ GitLab ผ่าน Web Browser
http://localhost:8080
- ใช้ username เป็น root
- ใช้ password ที่คุณตั้งค่าใหม่ในขั้นตอนก่อนหน้า

### Check your sign-up restrictions
Your GitLab instance allows anyone to register for an account, which is a security risk on public-facing GitLab instances. You should deactivate new sign ups if public users aren't expected to register for an account.

## 4.ปิดการสมัครสมาชิกใหม่ (Sign-Up) ใน GitLab เพื่อลดความเสี่ยงด้านความปลอดภัย
- ใช้บัญชี root หรือบัญชีแอดมินที่มีสิทธิ์สูงสุดเพื่อล็อกอินเข้า GitLab
- ไปที่:
    - Menu > Admin Area (คลิก Avatar มุมขวาบน แล้วเลือก Admin)
    - เลือก Settings (การตั้งค่า) ในแถบด้านซ้ายมือ

## 5.แก้ไข Sign-Up Restrictions
- Uncheck (ยกเลิกการเลือก) ตัวเลือก:
    - Sign-up enabled (เปิดการสมัครสมาชิกใหม่)
- หลังจากยกเลิกเลือกแล้ว ผู้ใช้งานใหม่จะไม่สามารถสมัครสมาชิกได้เอง

## 6. บันทึกการเปลี่ยนแปลง
กด Save Changes (บันทึกการตั้งค่า)