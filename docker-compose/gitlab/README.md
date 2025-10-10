### SET SWAP (VOL-TO-MEMORY)
```bash
notepad "$env:USERPROFILE\.wslconfig"
```
```bash
[wsl2]
memory=6GB                  # จำกัด RAM สูงสุดให้ WSL2 ใช้ได้ (ปรับตามแรมเครื่อง)
processors=4                # จำนวน CPU core ที่ให้ใช้
swap=4GB                    # ขนาดไฟล์ swap (ช่วยกันแรมไม่พอ)
swapfile=D:\\wsl-swap.vhdx  # ที่เก็บไฟล์ swap
localhostForwarding=true    # ให้ forward localhost อัตโนมัติ
```

```bash
wsl --shutdown
```
เปิด wsl
```bash
free -h
```
               total        used        free      shared  buff/cache   available
Mem:           5.8Gi       257Mi       5.4Gi       2.0Mi       180Mi       5.3Gi
Swap:          4.0Gi          0B       4.0Gi