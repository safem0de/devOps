https://www.mysmartserver.com/2022/05/11/deploy-snipe-it-with-kubernetes/

kubectl create namespace snipe-it
kubectl apply -f ./ --namespace=snipe-it

kubectl port-forward service/snipe-entrypoint 9000:80