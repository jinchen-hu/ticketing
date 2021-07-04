To break the connection inside k8s for testing nats streaming server, do the following commands
1. `kubectl get pods` list all the running pods
2. `kubectl port-forward <nats-pod-name 4222:4222>`  
   point the k8s port to the actual/local host port for nats streaming server
3. `kubectl port-forward <nats-pod-name 8222:8222>`   
   point the k8s port to the actual/local host port for monitoring
   
### TODO
solution for Concurrency issue
* Durable subscription  
  This enables the subscriber to close the connection without canceling the subscription and resume the subscription with same durable name. Note the server will resume the subscription with messages that have not been acknowledged, while the 
  acknowledged will be marked as "PROCESSED"