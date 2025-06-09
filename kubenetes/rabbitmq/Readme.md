```bash
kubectl create namespace rabbitmq
kubectl apply -f deployment.yaml -n rabbitmq
```

ติดตาม logs แบบ realtime ให้เพิ่ม -f (เหมือน tail -f):
```bash
kubectl logs -n rabbitmq -f rabbitmq-946df47f5-trxhp
```

```bash
kubectl get svc -n rabbitmq
```

Test
```bash
npm i
```
```bash
node producer.js
node consumer.js
```
