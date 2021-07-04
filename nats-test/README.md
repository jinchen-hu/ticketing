To break the connection inside k8s for testing nats streaming server, do the following commands
1. `kubectl get pods` list all the running pods
2. `kubectl port-forward <nats-pod-name 4222:4222>`