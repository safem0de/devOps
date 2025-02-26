```bash
dotnet new webapi -n MyDotnetApp
cd MyDotnetApp
dotnet watch run
```

## สร้างไฟล์ .gitignore สำหรับโปรเจค .NET
```bash 
dotnet new gitignore
```

## add ลง ไปใน readme (ไปสร้าง project เอาเอง)
```bash 
## Need only Dockerfile file
*
!Dockerfile
```

## Build & Push ไปที่ Private Registry
```bash 
nerdctl build -t 127.0.0.1:32000/mydotnetapp:latest .
nerdctl push 127.0.0.1:32000/mydotnetapp:latest

curl -X GET http://127.0.0.1:32000/v2/_catalog
``` 

```bash 
cd ..

kubectl apply -f dotnet-deployment.yaml
kubectl apply -f dotnet-service.yaml

curl http://localhost:30080/weatherforecast
``` 