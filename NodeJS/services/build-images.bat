@echo off
echo Building Docker images for all services...

:: Switch to Minikube's Docker environment
echo Switching to Minikube's Docker environment...
call minikube docker-env | findstr /i "set" > temp_docker_env.bat
call temp_docker_env.bat
del temp_docker_env.bat

:: Remove existing images if they exist
echo Removing existing Docker images...
docker rmi -f library-service:1.0 user-service:1.0 order-service:1.0

:: Navigate to library-service and build the Docker image
cd library-service
echo Building library-service image...
docker build -t library-service:1.0 .
cd ..

:: Navigate to user-service and build the Docker image
cd user-service
echo Building user-service image...
docker build -t user-service:1.0 .
cd ..

:: Navigate to order-service and build the Docker image
cd order-service
echo Building order-service image...
docker build -t order-service:1.0 .
cd ..

echo Docker images built successfully!
pause
