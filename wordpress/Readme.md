### Edit upload size
#### /usr/local/etc/php/php.ini-production
```bash
nerdctl exec -it wordpress /bin/bash
```
```bash
cp /usr/local/etc/php/php.ini-production /usr/local/etc/php/php.ini
```
```bash
nano /usr/local/etc/php/php.ini
```
#### Ctrl + W for search the keyword
```bash
upload_max_filesize = 10M
post_max_size = 32M
max_execution_time = 300
```