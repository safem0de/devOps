### ลบของเก่า (ถ้ามี)
```bash
kubectl delete namespace apache-airflow-test --force --grace-period=0
```

### Apply ไฟล์ทีละไฟล์
```bash
kubectl apply -f namespace.yaml
kubectl apply -f storage.yaml
kubectl apply -f postgres.yaml
kubectl apply -f redis.yaml
kubectl apply -f airflow.yaml
```

### ตรวจสอบสถานะ
```bash
kubectl get pods -n apache-airflow-test
```

### ดู log ของ airflow-init
```bash
kubectl logs -n apache-airflow-test job/airflow-init
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
### ลบ deployment ของ namespaces
```bash
kubectl delete deployment airflow -n apache-airflow-test
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

## Restart 
```bash
kubectl delete pod -n apache-airflow-test --selector=app=airflow
kubectl apply -f airflow.yaml
```

## ดู pods 
```bash
kubectl exec -it -n apache-airflow-test <pod-name> -c airflow-webserver -- ls
```

### เปิด Web UI ของ Airflow (no use)
```bash
kubectl port-forward svc/airflow-webserver 8080:8080 -n apache-airflow-test
```

### ถ้า Run บน Linux
```bash
sudo mkdir -p /mnt/data/airflow
sudo chown 50000:50000 /mnt/data/airflow
sudo chmod 777 /mnt/data/airflow  # หรือใช้สิทธิ์ที่เหมาะสม
```
uncomment
```bash
securityContext:
  runAsUser: 50000
  runAsGroup: 50000
```