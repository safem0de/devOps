# ลบไม่ช่วยให้ลืม
### ลบ deployment ของ namespaces
```bash
kubectl delete deployment airflow -n apache-airflow-test
```
### ลบ namespace ของเก่า (ถ้ามี)
```bash
kubectl delete namespace apache-airflow-test --force --grace-period=0
```
### ลบ pv 
```bash
kubectl delete pv airflow-pv -n apache-airflow-test
```
### ลบ pvc
```bash
kubectl delete pvc airflow-pvc -n apache-airflow-test
```
### ลบ StorageClass เดิม
```bash
kubectl delete storageclass airflow-storage
```
---

### Apply ไฟล์ทีละไฟล์
```bash
kubectl apply -f namespace.yaml
kubectl apply -f storage.yaml
kubectl apply -f postgres.yaml
kubectl apply -f redis.yaml
kubectl apply -f airflow.yaml
kubectl apply -f set_celery.yaml
```

### ตรวจสอบสถานะ
```bash
kubectl get pods -n apache-airflow-test
```
### ดู service ของ namespaces
```bash
kubectl get svc -n apache-airflow-test
```
### เช็คว่า PVC ถูก bind กับ PV หรือไม่
```bash
kubectl get pvc airflow-pvc -n apache-airflow-test
```
* ถ้า PVC ยังอยู่ในสถานะ Pending → แสดงว่า Kubernetes ไม่สามารถหา PV ที่ match ได้

### เช็คว่า PVC ถูกสร้างและ Bound กับ PV ได้หรือไม่
```bash
kubectl get pvc -n apache-airflow-test
kubectl get pv
```

### เช็คว่า Pod ของ Airflow ทำงานได้ปกติ
```bash
kubectl get pods -n apache-airflow-test
kubectl logs deployment/airflow -n apache-airflow-test
```

### เปิด Web UI ของ Airflow (no use)
```bash
kubectl port-forward svc/airflow-webserver 8080:8080 -n apache-airflow-test
```

### ดู pod/Logs/exec
```bash
kubectl get pods -n apache-airflow-test
## example.
# NAME                        READY   STATUS    RESTARTS   AGE
# airflow-697c558454-l7rf2    4/4     Running   0          3m25s
# postgres-849f7c79df-xp8cg   1/1     Running   0          124m
# redis-74fb5fd858-bn2kh      1/1     Running   0          124m
kubectl logs airflow-697c558454-l7rf2 -n apache-airflow-test -c git-sync
kubectl exec -it -n apache-airflow-test airflow-697c558454-l7rf2 -c airflow-webserver -- ls -al dags # ดู dags
```

### เข้าไปใน container
```bash
kubectl exec -it -n apache-airflow-test airflow-697c558454-l7rf2 -c airflow-webserver -- sh
```
## kube-prometheus
```bash

```
```bash
kubectl apply --server-side -f manifests/setup
kubectl wait \
	--for condition=Established \
	--all CustomResourceDefinition \
	--namespace=monitoring
kubectl apply -f manifests/
```
### Apache-Airflow
```bash
kubectl port-forward svc/airflow-webserver 8080:8080 -n apache-airflow-test
```
### Grafana
```bash
kubectl port-forward svc/grafana -n monitoring 3000:3000
```
### Prometheus
```bash
kubectl port-forward svc/prometheus-k8s -n monitoring 9090:9090
```