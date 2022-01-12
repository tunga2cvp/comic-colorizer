kubectl apply -f k8s/deploy-backend.yaml
kubectl apply -f k8s/deploy-frontend.yaml
kubectl expose deployment comic-colorizer-backend \
  --name=comic-colorizer-service --type=LoadBalancer \
  --port 5000 \
  --target-port 8765
kubectl expose deployment comic-colorizer-frontend \
  --name=comic-colorizer-ui --type=LoadBalancer \
  --port 3000 \
  --target-port 3000