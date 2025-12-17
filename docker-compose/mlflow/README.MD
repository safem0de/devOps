### ติดตั้ง Cloudflared บน Windows
- รันใน PowerShell (Administrator):
```bash
winget install Cloudflare.cloudflared
```
- เสร็จแล้วปิด-เปิด terminal ใหม่ แล้วลอง:
```bash
cloudflared --version
```
- เปิด tunnel (mlflow)
```bash
cloudflared tunnel --url http://127.0.0.1:5000 --http-host-header localhost
```
- เปิด tunnel (minio)
```bash
cloudflared tunnel --url http://127.0.0.1:9000 --http-host-header localhost
```
