```bash
cd registry
kubectl apply -f pv.yaml
kubectl apply -f pvc.yaml
kubectl apply -f registry-deployment.yaml
kubectl apply -f registry-service.yaml
kubectl apply -f storageclass.yaml
kubectl apply -f local-path-rbac.yaml

kubectl delete -f pv.yaml
kubectl delete -f pvc.yaml
kubectl delete -f registry-deployment.yaml
kubectl delete -f registry-service.yaml
kubectl delete -f storageclass.yaml
kubectl delete -f local-path-rbac.yaml
```


```bash
kubectl delete pvc registry-pvc
kubectl patch pvc registry-pvc -p '{"metadata":{"finalizers":null}}' --type=mergekubectl patch pvc registry-pvc -p '{"metadata":{"finalizers":null}}' --type=merge
```

## ตรวจสอบ Image ที่อยู่ใน Registry:
```bash
curl -X GET http://127.0.0.1:32000/v2/_catalog
```
## testrun folder auth
```bash
kubectl create secret docker-registry my-registry-secret \
    --docker-server=127.0.0.1:5000 \
    --docker-username=myuser \
    --docker-password=mypassword \
    --docker-email=myemail@example.com
```
curl -u myuser:mypassword -X GET http://127.0.0.1:5000/v2/_catalog


## testrun folder (docker)
```bash
docker pull alpine:latest
docker tag alpine:latest 127.0.0.1:5000/alpine:latest
docker images | grep 127.0.0.1:5000/alpine
docker push 127.0.0.1:5000/alpine:latest

cd testrun

kubectl apply -f alpine-deployment.yaml
kubectl get pods -l app=alpine

kubectl exec -it $(kubectl get pod -l app=alpine -o jsonpath='{.items[0].metadata.name}') -- sh
```
ถ้าเข้าไปใน Shell ได้ แสดงว่า alpine ใช้งานได้จริง!

```bash
sudo netstat -tulnp
```

## เช็คว่า Firewall บล็อก Port หรือไม่
```bash
sudo ufw status
```
```bash
sudo ufw allow 32000/tcp
sudo ufw reload
```

## testrun folder (rancher)
```bash
nerdctl pull alpine:latest
nerdctl tag alpine:latest 127.0.0.1:32000/alpine:latest
nerdctl push 127.0.0.1:32000/alpine:latest

kubectl apply -f alpine-deployment.yaml
kubectl get pods -l app=alpine

kubectl exec -it $(kubectl get pod -l app=alpine -o jsonpath='{.items[0].metadata.name}') -- sh
```
หรือใช้แบบนี้
```bash
kubectl exec -it alpine-787794cd96-8x227 -n default -- sh
```

## ตรวจสอบค่า insecure-registries ใน K3s
Failed to pull image 
"10.1.160.53:5000/alpine:latest": failed to pull and unpack image 
"10.1.160.53:5000/alpine:latest": failed to resolve reference 
"10.1.160.53:5000/alpine:latest": failed to do request: Head "https://10.1.160.53:5000/v2/alpine/manifests/latest": 
http: server gave HTTP response to HTTPS client

## แก้ไขไฟล์ในเครื่อง ตรวจสอบค่า insecure-registries ใน K3s
```bash
sudo cat /etc/rancher/k3s/registries.yaml
or
sudo nano /etc/rancher/k3s/registries.yaml
# ctrl + x
# y --> enter

or

vi /etc/rancher/k3s/registries.yaml
# esc
# :qa --> enter
```
add
```bash
mirrors:
  "127.0.0.1:5000":
    endpoint:
      - "http://127.0.0.1:5000"
```
example
```bash
mirrors:
  docker.io:
    endpoint:
      - "https://registry-1.docker.io"

  "10.1.160.53:5000":   # ✅ เพิ่ม Registry นี้เข้าไป
    endpoint:
      - "http://10.1.160.53:5000"   # ✅ ใช้ HTTP (ไม่ใช่ HTTPS)

configs:
  "registry-1.docker.io":
    auth:
      secretName: "my-docker-secret"
```


ตั้งค่า Kubelet ให้รองรับ Insecure Registry
บน ทุก Worker Node
แก้ไขไฟล์ Kubelet config
```bash
sudo nano /var/lib/kubelet/config.yaml
```
add
```bash
featureGates:
  AllowInsecureBackendProxy: true
```
```bash
sudo systemctl restart kubelet
```

## Check All Secrets
```bash
kubectl get secret -n default
```