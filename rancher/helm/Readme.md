## เพิ่ม Helm Repository
```bash
helm repo add rancher-stable https://releases.rancher.com/server-charts/stable
helm repo update
```

## ติดตั้ง Cert-Manager
```bash
kubectl create namespace cert-manager
helm repo add jetstack https://charts.jetstack.io
helm repo update
```

```bash
helm install cert-manager jetstack/cert-manager --namespace cert-manager --set installCRDs=true
```

## ตรวจสอบว่า Cert-Manager ทำงานหรือยัง
```bash
kubectl get pods -n cert-manager
```

## ติดตั้ง Rancher บน K3s
```bash
kubectl create namespace cattle-system
helm install rancher rancher-stable/rancher --namespace cattle-system --set hostname=rancher.localhost
```

## ตรวจสอบสถานะของ Rancher
```bash
kubectl get pods -n cattle-system
```

## เข้าถึง Rancher UI
```bash
kubectl port-forward -n cattle-system svc/rancher 8443:443
```

## ใช้ Git Bash (ถ้าติดตั้ง Git for Windows)
### ถ้าคุณติดตั้ง Git for Windows, คุณสามารถใช้ base64 -d ได้โดยเปิด Git Bash (Win + R พิมพ์ git bash แล้วกด Enter)
รันคำสั่ง:
```bash
Edit
kubectl get secret --namespace cattle-system bootstrap-secret -o jsonpath="{.data.bootstrapPassword}" | base64 -d
```