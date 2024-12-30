# ใช้ภาพ WordPress เป็นพื้นฐาน
FROM wordpress:latest

# คัดลอกไฟล์ในโฟลเดอร์ปัจจุบันไปยัง /var/www/html
COPY . /var/www/html

# ติดตั้งส่วนเสริมเพิ่มเติมหากจำเป็น
RUN apt-get update && apt-get install -y \
    vim \
    curl \
    nano 

# เปิดพอร์ต 80 สำหรับ WordPress
EXPOSE 80
