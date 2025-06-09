kubectl create namespace logging

kubectl apply -f loki/deployment.yaml
kubectl apply -f grafana/deployment.yaml
kubectl apply -f fluentbit/deployment.yaml

kubectl port-forward -n logging svc/grafana 3000:3000
kubectl port-forward -n logging svc/loki 3100:3100

kubectl get pods -n logging
kubectl logs -n logging <container name>