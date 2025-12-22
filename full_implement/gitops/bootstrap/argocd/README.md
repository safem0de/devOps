### * apply argocd to kube*
```bash
kubectl apply -k ~/bootstrap/argocd
```

### * check argocd (service)*
```bash
kubectl -n argocd get svc argocd-server -o wide
kubectl -n argocd get cm argocd-cm -o yaml | grep -n "server.insecure"
```

### * เอารหัส admin:*
```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo
```

### * เช็คว่า Argo CD เปิดพอร์ตไหน*
```bash
kubectl -n argocd get svc argocd-server
```