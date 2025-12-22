ลบ ArgoCD ที่ไปอยู่ default (เฉพาะของ argocd)
```bash
# ลบ workload + svc + cm + secret + sa + rbac + netpol ใน default ที่เป็น argocd-
kubectl -n default delete deploy,sts,svc,cm,secret,sa,role,rolebinding,networkpolicy \
  $(kubectl -n default get deploy,sts,svc,cm,secret,sa,role,rolebinding,networkpolicy -o name | grep '^.*/argocd-') \
  --ignore-not-found=true

# ลบ CRD (พวกนี้เป็น cluster-wide จะมี/ไม่มี ก็ได้ แต่ลบเพื่อ clean slate)
kubectl delete crd applications.argoproj.io applicationsets.argoproj.io appprojects.argoproj.io --ignore-not-found=true

# ลบ clusterrole/clusterrolebinding ของ argocd
kubectl delete clusterrole,clusterrolebinding \
  $(kubectl get clusterrole,clusterrolebinding -o name | grep 'argocd' || true) \
  --ignore-not-found=true
```

kubectl apply -k ~/bootstrap/argocd

kubectl -n argocd get svc argocd-server -o wide
kubectl -n argocd get cm argocd-cm -o yaml | grep -n "server.insecure"

เอารหัส admin:
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo