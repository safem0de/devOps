cd D:\Projects\devOps\docker-compose\gitlab\test-pipeline

# สร้าง repo git ใหม่
git init

# เพิ่มไฟล์ทั้งหมด
git add .

# commit ครั้งแรก
git commit -m "Initial commit for test-pipeline"

# เชื่อมกับ remote repository (เปลี่ยน URL ให้เป็นของคุณ)
git remote add origin http://localhost:8929/root/test-pipeline.git

# push ขึ้น branch main
git push -u origin main