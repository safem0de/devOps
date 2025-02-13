@echo off
echo Creating .env file...
(
    echo HOMEDIR=%USERPROFILE%
) > .env

echo Stopping Docker Compose...
docker-compose down

echo Starting Docker Compose in detached mode...
docker-compose up -d

echo Done!