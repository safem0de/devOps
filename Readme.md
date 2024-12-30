### How to install Docker Desktop on a different drive (location) on Windows
#### reference: https://stackoverflow.com/questions/75727062/how-to-install-docker-desktop-on-a-different-drive-location-on-windows

- Don't install using double click on "Docker Desktop Installer.exe".
- Open Windows Terminal as Administrator (right click on the Terminal icon and click on "Run as Administrator"). Make sure you're using Windows Terminal and not Powershell, as the commands are formatted differently (see the Documentation).
- Go to the folder where "Docker Desktop Installer.exe" downloaded.

```bash
start /w "" "Docker Desktop Installer.exe" install -accept-license  --installation-dir=D:\\ProgramFiles\\Docker
```

Note: the installer does not create the "Docker" dir this way if you don't specify a directory after the driver letter. Make sure to write E:\Docker at minimum
Note: the WSL, image etc still will be in %HOME%\AppData\Local\Docker. As noted in comments, you can change that too by adding: --wsl-default-data-root=E:\path\to\data\folder
(for Windows 11, you might also check the another answer in this thread)

Documentation: https://docs.docker.com/desktop/install/windows-install/#install-from-the-command-line

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
docker builder prune --force
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
### 2.1 เมื่ออยู่ใน container GitLab แล้ว ให้ใช้คำสั่ง gitlab-rails console เพื่อรีเซ็ตรหัสผ่านแอดมิน:

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

### 2.2 เข้าสู่ระบบ GitLab ผ่าน Web Browser
http://localhost:8080
- ใช้ username เป็น root
- ใช้ password ที่คุณตั้งค่าใหม่ในขั้นตอนก่อนหน้า

### Check your sign-up restrictions
Your GitLab instance allows anyone to register for an account, which is a security risk on public-facing GitLab instances. You should deactivate new sign ups if public users aren't expected to register for an account.

### 2.3 ปิดการสมัครสมาชิกใหม่ (Sign-Up) ใน GitLab เพื่อลดความเสี่ยงด้านความปลอดภัย
- ใช้บัญชี root หรือบัญชีแอดมินที่มีสิทธิ์สูงสุดเพื่อล็อกอินเข้า GitLab
- ไปที่:
    - Menu > Admin Area (คลิก Avatar มุมขวาบน แล้วเลือก Admin)
    - เลือก Settings (การตั้งค่า) ในแถบด้านซ้ายมือ

### 2.4.แก้ไข Sign-Up Restrictions
- Uncheck (ยกเลิกการเลือก) ตัวเลือก:
    - Sign-up enabled (เปิดการสมัครสมาชิกใหม่)
- หลังจากยกเลิกเลือกแล้ว ผู้ใช้งานใหม่จะไม่สามารถสมัครสมาชิกได้เอง

### 2.5. บันทึกการเปลี่ยนแปลง
กด Save Changes (บันทึกการตั้งค่า)


### 3. OpenSSL version 3
Starting with GitLab 17.7, OpenSSL 3 will be used. All TLS connections require TLS 1.2 or higher. 
Weaker ciphers are no longer supported. 
Encryption must have at least of 112 bits of security. Learn more.

### 3.1. ตรวจสอบ OpenSSL เวอร์ชันปัจจุบัน
รันคำสั่งนี้บนเซิร์ฟเวอร์ที่ติดตั้ง GitLab:

```bash
openssl version
```
หากเป็นเวอร์ชันเก่ากว่า 3.0 จำเป็นต้องอัปเกรด

### 3.2. อัปเกรด OpenSSL เป็นเวอร์ชัน 3
เวอร์ชันของระบบปฏิบัติการ (Operating System)
```bash
cat /etc/os-release
```
```bash
uname -a
```

บน Ubuntu/Debian:
```bash
sudo apt update
sudo apt install openssl
openssl version
```

บน CentOS/RHEL:
```bash
sudo yum update
sudo yum install openssl
openssl version
```

## การ Export Docker Image
### 1. ใช้คำสั่ง docker save
คำสั่งนี้จะสร้างไฟล์ .tar ที่สามารถแชร์หรือเก็บไว้ได้:

```bash
docker save -o <output-file>.tar <image-name>:<tag>
```
ตัวอย่าง:

```bash
docker save -o my-image.tar my-image:latest
```

my-image.tar: ชื่อไฟล์ที่ต้องการบันทึก
my-image:latest: ชื่อและแท็กของ image ที่ต้องการ export

## การ Import Docker Image
### 1. ใช้คำสั่ง docker load
เมื่อคุณมีไฟล์ .tar จากการ export แล้ว คุณสามารถนำเข้า image ในเครื่องอื่นได้:

```bash
docker load -i <input-file>.tar
```
ตัวอย่าง:
```bash
docker load -i my-image.tar
```

หลังจากนำเข้า Docker จะเพิ่ม image เข้าใน local image store คุณสามารถตรวจสอบได้ด้วย:
```bash
docker images
```

## Rancher Desktop
#### reference : https://www.somkiat.cc/working-with-rancher-desktop/

1. Enable Kubernetes
- Kubernetes Version (v1.31.4 (stable,latest))
2. dockerd (moby) ใช้ Docker API ซึ่งสามารถใช้งานร่วมกับ Docker CLI ได้ เช่นคำสั่ง docker ที่คุณคุ้นเคย
สามารถทำงานร่วมกับเครื่องมืออื่น ๆ ที่ต้องการ Docker API เช่น Docker Compose และ k3d

### วิธีตรวจสอบและตั้งค่า PATH ตรวจสอบว่าไฟล์ไบนารีอยู่ที่ไหน

สำหรับ Rancher Desktop ติดตั้งบน Windows: ไบนารี เช่น nerdctl หรือ docker มักจะอยู่ในโฟลเดอร์ที่ Rancher Desktop ติดตั้ง 
(เริ่มต้นคือ %LOCALAPPDATA%\Programs\Rancher Desktop\resources หรือโฟลเดอร์ที่ Rancher Desktop ใช้)

win + R (Set path)
```bash
sysdm.cpl
```
บน Windows --> Command Prompt :
```bash
where rancher
where kubectl
where docker
```
บน macOS/Linux --> Terminal :
```bash
which rancher
which kubectl
which docker
```
check Kubernetes version
```bash
kubectl version --client
```
##### ถ้าเจอปัญหาบน Rancher Desktop
error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/v1.47/version": open //./pipe/dockerDesktopLinuxEngine: 
The system cannot find the file specified.

run cmd
```bash
set DOCKER_HOST=npipe:////./pipe/docker_engine
```

ตรวจสอบสถานะ WSL และ Distribution:
```bash
wsl -l -v
```
```bash
nerdctl compose up -d
or
nerdctl compose -f docker-compose.yml up -d
```