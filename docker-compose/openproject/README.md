#### คุณสามารถ reset admin ผ่าน Rails console โดยตรง:
1. เข้า container:
```bash
docker exec -it <container_name> bash
```
2. เปิด Rails console:
```bash
RAILS_ENV=production bundle exec rails console
```
ใน console พิมพ์โค้ดนี้:
```bash
user = User.find_by(login: 'admin')
user.password = 'NewStrongPassword123!'
user.password_confirmation = 'NewStrongPassword123!'
user.failed_login_count = 0
user.save!
```
3. ออกจาก console:
```bash
exit
```