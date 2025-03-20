## Pull image
```bash
nerdctl pull mcr.microsoft.com/mssql/server:2022-latest
```

## Remove container
```bash
nerdctl rm -f sqlserver
```

## Mount without volume
```bash
nerdctl run -d \
  --name sqlserver \
  --restart always \
  -e "ACCEPT_EULA=Y" \
  -e "SA_PASSWORD=Str0ngP@ss!" \
  -p 1433:1433 \
  mcr.microsoft.com/mssql/server:2022-latest
```

## Add permission for container (PowerShell Admin)
```bash
icacls "D:\devOps\sqlserver\sqlserver-data" /setowner Everyone /T /C
icacls "D:\devOps\sqlserver\sqlserver-data" /grant Everyone:F /T
```

## Mount with volume
```bash
nerdctl run -d \
  --name sqlserver \
  --restart always \
  --user root \
  -e "ACCEPT_EULA=Y" \
  -e "SA_PASSWORD=Str0ngP@ss!" \
  -p 1433:1433 \
  -v "D:\devOps\sqlserver\sqlserver-data:/var/opt/mssql" \
  mcr.microsoft.com/mssql/server:2022-latest
```
* ให้ container ทำงานใน mode root เพื่อหลีกเลี่ยงปัญหาสิทธิ์

## Access Container
```bash
nerdctl exec -it sqlserver sh
```