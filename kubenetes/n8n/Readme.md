# SMTP E-mail

SSL/TLS เวอร์ชันของเซิร์ฟเวอร์ SMTP
```bash
openssl s_client -connect smtp.office365.com:587
```
STARTTLS
```bash
openssl s_client -starttls smtp -connect smtp.yourserver.com:587
```
