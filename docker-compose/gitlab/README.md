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