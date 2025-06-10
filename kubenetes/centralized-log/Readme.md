kubectl create namespace logging

kubectl apply -f loki/deployment.yaml
kubectl apply -f grafana/deployment.yaml
kubectl apply -f fluentbit/deployment.yaml

kubectl port-forward -n logging svc/grafana 3000:3000
kubectl port-forward -n logging svc/loki 3100:3100

kubectl get pods -n logging
or
kubectl get pods -n logging -l app=fluent-bit

kubectl logs -n logging <pods name>
or
kubectl logs -n logging -l app=fluent-bit

kubectl describe pod -n logging <pods name>

curl http://localhost:3100/loki/api/v1/labels
{"status":"success","data":["job"]}