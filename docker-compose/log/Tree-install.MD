# 1. Download tree for Windows (Run as Administrator)
```bash
curl -L https://downloads.sourceforge.net/gnuwin32/tree-1.5.2.2-bin.zip -o tree.zip
```

# 2. Extract
```bash
unzip tree.zip
```

# 3. Copy tree.exe ไปที่ Git Bash bin
```bash
cp bin/tree.exe "C:/Program Files/Git/usr/bin/"
```

# 4. ลบไฟล์ที่ download
```bash
rm -rf tree.zip bin
```
