# install
./google-cloud-sdk/install.sh
gcloud init
gcloud components install kubectl
export PROJECT_ID=comvis-ict-2021
gcloud config set project $PROJECT_ID
gcloud artifacts locations list
# create registry
gcloud artifacts repositories create comic-colorizer \
  --repository-format=docker \
  --location=asia-southeast1 \
  --description="Docker repository"
# create and push image
cd "$PATH_TO_PROJECT/comic-colorizer" || exit
cd backend || exit
docker build -t comic-colorizer-backend:1.0.0 .
docker tag comic-colorizer-backend:1.0.0 asia-southeast1-docker.pkg.dev/${PROJECT_ID}/comic-colorizer/comic-colorizer-backend:v1c
gcloud auth configure-docker asia-southeast1-docker.pkg.dev
docker push asia-southeast1-docker.pkg.dev/comvis-ict-2021/comic-colorizer/comic-colorizer-backend:v1
# create cluster = {mode = autopilot}
gcloud config set compute/region asia-southeast1
gcloud container clusters create-auto comic-colorizer-cluster
 gcloud services enable container.googleapis.com
gcloud container clusters create-auto comic-colorizer-cluster
kubectl get nodes
# deploy backend app
cd ../deployment || exit
kubectl apply -f k8s/deploy-backend.yaml
kubectl describe deploy/comic-colorizer-backend
kubectl get pod
kubectl get deploy
kubectl logs deploy/comic-colorizer-backend
kubectl logs -f deploy/comic-colorizer-backend
# deploy backend network service
kubectl expose deployment comic-colorizer-backend --name=comic-colorizer-service --type=LoadBalancer --port 5000 --target-port 5000
kubectl get service
telnet 34.126.128.91 5000