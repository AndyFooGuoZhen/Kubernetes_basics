# Resrouce : https://www.youtube.com/watch?v=JoHUi9KvnOA&list=PLxAp0ELKVyrnjVDfF3tWhhW7aAtgUsl9N&index=5

# Kubernetes_basics

## Docker vs Kubernetes
Docker (container platform)
- ephemeral (short life cycle), containers can stop and revive
  
Kubernetes (container orchestration platform)

## Issues with only using docker / Why use Kubernetes

### Docker is Single host
Suppose there's 100 containers, container no.1 takes up too munch memory, causing container 100 to stop running

### Auto healing
Kubernetes can restart containers that have stopped running automaticly. Requires less develoepr's supervision

### Auto scaling
When container has supports lots of users, increase container count , usage of loadbalancer to direct users to appropriate container (can't tell specific users to use link1, link2 , etc)

### Docker doesnt support enterprise level support
- Load balancing
- Firewall
- Healing
- Scaling
- Api gateway

### Kubernetes 
- Cluster (Group of nodes), in production kubernetes is generally installed as a cluster
- EX: using the prev example, suppose container 1 causes issue for container 99, using kubernetes, container 99 can be placed and ran on a different node
- Depends on yaml files. (Fixes single host problem)
  
### ReplicaSet / replication controller 
A yaml file, used to ensure the desired number of replica pods are running and maintained within a cluster. 

### HPA 
Horizontal Pod Autoscaler, which is a Kubernetes feature that automatically adjusts the number of replicas of a pod based on the current resource utilization or custom metrics. If container utilization is high, spin up more containers.(Autoscale)

### Autohealing
Upon receiving a signal from API server, before container goes down, kubernetes will start a new container

### Ingress controller
A component responsible for handling incoming network traffic and routing it to the appropriate services within the cluster.
