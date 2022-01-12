# Comic Colorizer
Webapp for colorizing comic books ;)  
Using our Computer Vision course's capstone project as the core model of backend service
## To run this project
### 1. As Local Process
#### Frontend
```javascript
cd frontend
npm i
npm run start
```
#### Backend
```python
cd backend
python app.py
```
### 2. As Container
#### Build image
```bash
cd frontend
docker build -t comic-colorizer-frontend:v1 .
```
```bash
cd backend
docker build -t comic-colorizer-backend:v1 .
```
#### Deploy Kubernetes
```bash
cd deployment
kubectl apply -f k8s/deploy-backend.yaml
kubectl apply -f k8s/deploy-frontend.yaml
kubectl expose deployment comic-colorizer-backend --name=comic-colorizer-service --type=LoadBalancer --port 5000 --target-port 5000
kubectl expose deployment comic-colorizer-backend --name=comic-colorizer-service --type=LoadBalancer --port 3000 --target-port 3000
```
To check the public IP of our containers, run
```bash
kubectl get service
```
**Note**:   
For detailed configuration, please check yaml files in `deployment` directory. An extra Google Cloud setup script is also included.
## Website Previews 

