ลบของเก่า (ถ้ามี)

kubectl delete namespace apache-airflow-test --force --grace-period=0

Apply ไฟล์ทีละไฟล์


kubectl apply -f namespace.yaml
kubectl apply -f storage.yaml
kubectl apply -f database.yaml
kubectl apply -f airflow.yaml

ตรวจสอบสถานะ

kubectl get pods -n apache-airflow-test


ดู log ของ airflow-init

kubectl logs -n apache-airflow-test job/airflow-init

kubectl get svc -n apache-airflow-test

kubectl delete deployment airflow-triggerer -n apache-airflow-test