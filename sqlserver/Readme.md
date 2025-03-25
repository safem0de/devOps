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

## Add permission for container (Power Shell Admin)
```bash
wsl
nerdctl volume create sqlserver-data
```

## Mount with volume
```bash
nerdctl run -d \
  --name sqlserver \
  --restart always \
  -e "ACCEPT_EULA=Y" \
  -e "SA_PASSWORD=Str0ngP@ss!" \
  -p 1433:1433 \
  -v sqlserver-data:/var/opt/mssql \
  mcr.microsoft.com/mssql/server:2022-latest
```

## Access Container
```bash
nerdctl exec -it sqlserver sh
```