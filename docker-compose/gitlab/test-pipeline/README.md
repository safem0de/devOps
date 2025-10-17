## Documents
Setup project ➜ [Setup Project](docs/poc_setup.md)
อธิบาย CI ➜ [Explain CI](docs/explain_ci.md)

## Trip & Trick (README)
* สร้างโฟลเดอร์ docs/ แล้วใส่ไฟล์ Markdown / AsciiDoc ข้างใน เช่น:
```md
docs/
  overview.md
  how-to-run.md
  arch-diagram.png
```
* ลิงก์จาก README.md ไปหาไฟล์ใน docs/ ด้วยลิงก์สัมพัทธ์:
```md
ดูคู่มือการใช้งาน ➜ [How to run](docs/how-to-run.md)
```
* ลิงก์ข้ามไฟล์/ข้ามหัวข้อ:
```md
- [Overview](docs/overview.md)
- [How to run – เตรียมเครื่อง](docs/how-to-run.md#เตรียมเครื่อง)
```
* แทรกรูปภาพที่อยู่ใน repo:
```md
![Architecture](docs/arch-diagram.png)
```