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

## Kubernetes architecture
<img width="595" alt="Screenshot 2024-01-15 at 12 48 22 PM" src="https://github.com/AndyFooGuoZhen/Kubernetes_basics/assets/77149531/a8226ce4-afe8-4086-8b2d-1e80bd197f65">


### Components in worker node (Dataplane)
- Kube proxy
- Kubelet
- Container runtime

#### Container runtime vs Kubelet
Docker : You've built a container, to run a java application for that container , you need to have a container runtime (Dockershim).

Kubernetes : On default there will be a master node (Control plane) and worker node(s) (Data Plane). When user tries to deploy a pod, pod gets deployed on worker node, a component called Kubelet runs your pod that is reponsible for maintaining the pod. Inside the pods, there will be container runtimes (not necessarily dockershim as other container runtime alternatives can be used as well) to run the containers within the pods. Container runtime interacts with kubernetes with container interface.\

#### Docker0 (Veth) vs Kube proxy
Kube proxy provide network , IP addresses , load balancing capabilities to pods. 

### Components in master node (Control plane)
- Api server
- Scheduler
- ETCD
- Controller manager
- CCM

#### Api server / Controlpane 
Core components that exposes kubernetes, takes all external request. 

#### Scheduler
Scheduling resources on kubernets. Choose which node to schedule.

#### ETCD 
Key value store. Stores cluster related information. Mostly used for backup, restoration.

#### Controller manager
To support autoscaling, kubernetes have some controllers. EX: Replicaset maintains the state/number of pods.  In this case, the controller manager manages the replicaset controller.

#### Cloud controller manager (CCM)
Kubernetes has to understand underlying cloud provider. EX: Kubernetes has to create load balancer on AWS, kubernetes has to interact with cloud provider's API to manage load balancer.

CCM is open source, suppose there's a new cloud provider and one one's to deploy it on the new clour provider. New api's can be written onto the CCM to allow kubernetes to interact with the new cloud provider



