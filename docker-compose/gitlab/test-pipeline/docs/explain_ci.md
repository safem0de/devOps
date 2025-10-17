## โครงสร้างรวม
```yaml
stages:
  - build
  - deploy
```

กำหนด 2 stage เรียงลำดับ: สร้าง image (build) แล้วค่อย deploy
```yaml
variables:
  REGISTRY_ADDR: host.docker.internal:5005
  DOCKER_HOST: unix:///var/run/docker.sock
  PROJECT_SUBDIR: docker-compose/gitlab/test-pipeline
  CONTEXT_PATH: ${PROJECT_SUBDIR}/nextjs-poc
```

* `REGISTRY_ADDR` : ที่อยู่ของ private registry (วิ่งผ่าน host)
* `DOCKER_HOST` : บอก Docker CLI ใน job ให้คุยกับ Docker daemon ของเครื่อง host ผ่าน socket 
(`/var/run/docker.sock`) — ต้องแน่ใจว่า runner ถูกตั้งค่า mount socket นี้ไว้
* `PROJECT_SUBDIR` / `CONTEXT_PATH` : ช่วยระบุ path ของ build context ใน repo (รองรับทั้งโครงแบบ monorepo และกรณีที่โปรเจกต์อยู่ใต้โฟลเดอร์ย่อย)

Template งาน Docker ร่วมกัน
```yaml
.docker_job:
  image: docker:stable
  tags:
    - docker
  before_script:
    - set -eux
    - |
      if [ -n "${CA_CERT_BASE64:-}" ]; then \
        mkdir -p "/etc/docker/certs.d/${REGISTRY_ADDR}"; \
        echo "$CA_CERT_BASE64" | base64 -d > "/etc/docker/certs.d/${REGISTRY_ADDR}/ca.crt"; \
      else \
        echo "CA_CERT_BASE64 not set; skipping CA install"; \
      fi
    - docker version || true
    - docker info || true
```

* ใช้ `image: docker:stable` ให้มี Docker CLI ใน job
* `tags: [docker]` ให้ job ไปคิวกับ runner ที่ติด tag ชื่อนี้
* `set -eux`
    * `-e` เจอคำสั่ง fail ให้หยุดทันที
    * `-u` ใช้ตัวแปรที่ไม่ได้ set ให้ fail
    * `-x` echo คำสั่งที่รัน → debug ง่าย

* บล็อก CA: ถ้าตั้ง `CA_CERT_BASE64` ใน CI variables (เป็น cert base64 ของ self-signed registry) 
ก็จะ decode ใส่ `/etc/docker/certs.d/<REGISTRY_ADDR>/ca.crt` 
ซึ่งเป็นตำแหน่งที่ Docker มองหา CA ต่อ registry นั้น
* `docker version/info` เผื่อ debug สภาพแวดล้อม

> หมายเหตุ: สำหรับ self-signed ทั้ง host และ job ควร ใช้ชื่อ/พอร์ตตรงกัน 
> (เช่น host.docker.internal:5005) ระหว่าง CA path และ URL ที่ docker login

## BUILD
```yaml
build-image:
  stage: build
  extends: .docker_job
  script:
    - |
      IMAGE_TAG="${REGISTRY_ADDR}/root/test-pipeline:${CI_COMMIT_SHORT_SHA:-dev}"
      echo "IMAGE_TAG=${IMAGE_TAG}" > build.env
      echo "Using tag: ${IMAGE_TAG}"

      echo "Login to registry"
      : "${REGISTRY_USER:?Set REGISTRY_USER in CI variables}"
      : "${REGISTRY_PASSWORD:?Set REGISTRY_PASSWORD in CI variables}"
      echo "$REGISTRY_PASSWORD" | docker login -u "$REGISTRY_USER" --password-stdin "https://${REGISTRY_ADDR}"

      # Resolve build context for both monorepo and subproject cases
      CTX=""
      for c in "${CONTEXT_PATH}" "nextjs-poc" "."; do
        if [ -d "$c" ] && [ -f "$c/Dockerfile" ]; then CTX="$c"; break; fi
      done
      [ -n "${CTX}" ] || { echo "No valid build context found (tried ${CONTEXT_PATH}, nextjs-poc, .)"; ls -la; exit 1; }
      echo "Build image from ${CTX}"
      docker build -t "${IMAGE_TAG}" "${CTX}"

      echo "Push image"
      docker push "${IMAGE_TAG}"
  artifacts:
    expire_in: 1 day
    reports:
      dotenv: build.env
    paths:
      - build.env
  only:
    - main
```

* คำนวณ `IMAGE_TAG` แล้วเขียนลง `build.env` ตั้งแต่ต้น 
เพื่อให้ stage ต่อไปอ่านค่าได้เสมอ (ผ่าน `reports: dotenv`)
* เช็กให้แน่ใจว่ามี `REGISTRY_USER`/`REGISTRY_PASSWORD` (ถ้าไม่มีจะ fail พร้อมข้อความชัดเจน)
* Login ไปที่ `https://REGISTRY_ADDR`
* เลือก build context อัตโนมัติ: ไล่เช็ก 3 ทางเลือก (`CONTEXT_PATH`, `nextjs-poc`, `.`) 
จนเจอที่มี `Dockerfile` จริง ๆ แล้วใช้ path นั้น build
* Push image ขึ้น registry
* เก็บ `build.env` ทั้งเป็น artifact ปกติ (`paths`) และเป็น dotenv 
(เอาไว้ให้ stage ถัดไป import เป็น env var อัตโนมัติ)
* `only: main` ให้รันเฉพาะ branch main

## DEPLOY
```yaml
deploy:
  stage: deploy
  extends: .docker_job
  dependencies:
    - build-image
  script:
    - |
      echo "IMAGE_TAG from artifacts: ${IMAGE_TAG:-<empty>}"
      [ -n "${IMAGE_TAG:-}" ] || { echo "IMAGE_TAG is empty"; exit 1; }

      echo "Login to registry"
      echo "$REGISTRY_PASSWORD" | docker login -u "$REGISTRY_USER" --password-stdin "https://${REGISTRY_ADDR}"

      echo "Pull ${IMAGE_TAG}"
      docker pull "${IMAGE_TAG}"

      echo "Restart container"
      docker rm -f nextjs-poc || true
      # Next.js defaults to 3000; map host 3333 -> container 3000
      docker run -d --name nextjs-poc -p 3333:3000 "${IMAGE_TAG}"

      sleep 3
      docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}'
      echo "Deployment done"
  only:
    - main
```

* `dependencies: [build-image]` + `reports: dotenv` 
จาก build → `IMAGE_TAG` จะถูก inject เป็น env var โดยอัตโนมัติใน stage นี้
* ตรวจว่ามี IMAGE_TAG จริง (กันกรณี artifacts ไม่มา)
* login อีกครั้ง (แยก stage = คนละ container, คนละ $HOME, ต้อง login ใหม่)
* docker rm -f nextjs-poc || true ลบของเก่า (ไม่พังต่อให้ไม่เจอ)
* รัน container ใหม่: map พอร์ต 3333:3000 (Next.js ปกติ listen 3000)
* แสดง docker ps ไว้เช็กง่าย ๆ

### สิ่งที่ “ต้องมี” ใน runner/host เพื่อให้ pipeline นี้ทำงานจริง

Runner config

ใช้ executor docker

เปิด privileged = true (ถ้าจะใช้ dind) หรือ mount socket ของ host แทน (เราเลือกแบบ mount socket แล้วในไฟล์นี้)

มี volume: /var/run/docker.sock:/var/run/docker.sock

บน Host

Docker daemon กำลังรัน (เพราะเราใช้ DOCKER_HOST=unix:///var/run/docker.sock)

ถ้าใช้ self-signed registry: เครื่อง host ต้องเชื่อถือ CA ด้วย (Windows: วางไฟล์ไว้ที่ C:\ProgramData\Docker\certs.d\host.docker.internal:5005\ca.crt และ restart Docker Desktop / Linux: /etc/docker/certs.d/...)

CI variables

REGISTRY_USER, REGISTRY_PASSWORD (ของ registry นี้)

CA_CERT_BASE64 (optional แต่แนะนำ ถ้า registry เป็น self-signed)

ทำไมผมใช้ host.docker.internal:5005 แทน secure-registry:5000?

เพราะในแนวทางนี้ job container คุยกับ host (ผ่าน socket) อยู่แล้ว → login/push ไปยัง registry ผ่าน host-published port ตรง ๆ ชื่อ DNS host.docker.internal ใช้ได้ใน Linux Docker Desktop/Windows

ลดปัญหาการต้องเอา job เข้า network เดียวกับ service registry และช่วยให้ cert path (/etc/docker/certs.d/<host:port>) สอดคล้องกับ endpoint ที่ login ได้แน่นอน

กับ Next.js

ถ้า image ของคุณ expose 3333 (หรือปรับ npm start ให้ฟังพอร์ต 3333) ให้แก้บรรทัดรันเป็น -p 3333:3333

ตอนนี้ config สมมติว่า Next.js listen 3000 (ค่าดีฟอลต์) เลย map 3333:3000 — ปรับตาม Dockerfile/command จริงของคุณได้เลย

สรุปสั้น ๆ

โครงนี้ “ดี” ในแง่แนวทาง: ใช้ host Docker daemon → ง่าย/เร็ว, จัดการ CA self-signed ถูกตำแหน่ง, ดึง IMAGE_TAG ข้าม stage ด้วย dotenv, และ build context auto-detect

จุดที่ต้องเช็กนอกไฟล์: runner ต้อง mount /var/run/docker.sock และ host ต้อง trust CA ของ registry (รวมทั้งกรณี Windows)