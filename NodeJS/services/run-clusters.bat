@echo off

echo Delete existing deployments...
kubectl delete deployment library-service order-service user-service

echo Starting Kubernetes Clusters...

:: Check if Minikube is running
echo Checking Minikube status...
minikube status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Minikube is not running. Please start Minikube first.
    exit /b 1
)

:: Set Docker environment to Minikube's Docker daemon (optional, if you need to check Docker environment)
echo Switching to Minikube's Docker environment...
call minikube docker-env | findstr /i "set" > temp_docker_env.bat
call temp_docker_env.bat
del temp_docker_env.bat

:: Ensure kubectl context is set to Minikube
echo Setting kubectl context to Minikube...
kubectl config use-context minikube

:: Apply configurations for library-service
echo Deploying library-service...
kubectl apply -f library-service/library-service.yaml
if %ERRORLEVEL% NEQ 0 (
    echo Failed to deploy library-service.
    exit /b 1
)

:: Apply configurations for user-service
echo Deploying user-service...
kubectl apply -f user-service/user-service.yaml
if %ERRORLEVEL% NEQ 0 (
    echo Failed to deploy user-service.
    exit /b 1
)

:: Apply configurations for order-service
echo Deploying order-service...
kubectl apply -f order-service/order-service.yaml
if %ERRORLEVEL% NEQ 0 (
    echo Failed to deploy order-service.
    exit /b 1
)

:: Check the status of the deployed services/pods
echo Checking the status of deployed services...
kubectl get pods
kubectl get svc

echo All services deployed successfully!
pause
