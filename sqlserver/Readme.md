nerdctl pull mcr.microsoft.com/mssql/server:2022-latest

nerdctl run -d \
  --name sqlserver \
  --restart always \
  -e "ACCEPT_EULA=Y" \
  -e "SA_PASSWORD=Str0ngP@ss!" \
  -p 1433:1433 \
  mcr.microsoft.com/mssql/server:2022-latest
