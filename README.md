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
Kube proxy provide network , cluster IP addresses , load balancing capabilities to pods. 

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

#### Creating minitarized kubernetes cluster
1. Install Minikube : Creating kubernetes cluster
2. Install kubectl : kubernetes cli

#### Pods - Wrapper for container(s)
Deployed in kubernetes, wraps container(s). In docker, user specifies how to run docker containers by passing in parameters such as -p 3000:3000 for networking. In kubernetes, we specify these in a pod.yaml file.

Putting group of containers in a single pod, kubernetes will allow shared networking and shared storage among the containers. Containers inside a pod can talk to each other using localhost and access files via same file system.

When pods are created, a cluster IP address is generated for the pods.

### Minikube commands

#### Starting a cluster (Via docker driver)
```
minikube start
```

After starting cluster with minikube, kubectl get pods will return minikube as a running node

NOTE : In advanced cases, dont start it using docker driver, use command below instead.

#### Starting a cluster with specific memory requirements on VM
```
minikube start --memory=4096 --driver=hyperkit
```
Minikube creates a virtual machine then a single node on this VM.

#### Log in to access a cluster
```
minikube ssh
```
Then do curl <IP Address of pod> to access pod

### Kubectl - Kubernetes CLI

#### To check number of nodes
```
kubectl get nodes
```

#### Get no of pods
```
kubectl get pods
```

To see live updates , add -w behind command

#### Check pods details
```
kubectl get pods -o wide
```

#### Check deploys
```
kubectl get deploy
```

#### Creating a pod
```
kubectl create -f <name of pod.yaml file>
```
#### Deleting a pod
```
kubectl delete pod <name of pod>
```
#### Deleting a deployment
```
kubectl delete deploy <name of deploy>
```

#### Update / run a pod
```
kubectl apply -f <name of pod.yaml file>
```

#### Create / run a deployment
```
kubectl apply -f <name of deployment.yaml file>
```

#### Detailed inspection of a pod
```
kubectl describe pod <pod name>
```

#### Logs of a pod (Used for debugging application errors)
```
kubectl logs <pod name>
```

#### Get replicasets
```
kubectl get rs
```

### Pod config equiv to docker command

Pod.yaml
```
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80
```

Docker command
```
docker run -d nginx:1.14.2 --name nginx -p 80:80
```

## Container vs Pods vs Deploy

Container is used to wrap an application. To run the application via docker, parameters (networking, detahcment) can be provided to run the docker container.

Pod can be used to wrap multiple containers. Running config and container specifications are defined within a pod.yaml file. Benefit of using pods is that multiple containers are wrapped under a single logical unit, allowing containers to communicate with each other via localhost network.

Deploy allows pod to support autohealing and autoscaling feature. Using deploy, we never manually create the pods ourselves.

## Deploy
Deployment resource (a yaml file) is used to define how many pods are created. Deployment will also use the replicaset (a controller) to maintain the number of pods. When no of pods specified in deployment resource have changed, the desired state and actual state has a mismatch, replicaset detects this change and adds/deducts no of pods depending on the configuration in deployment

## Example deployment config

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

## Kubernetes Pods IP
Suppose we've created 3 pods as we specified 3 replicas in our deployment resource. With one pod deleted, a new pod will be created with a new IP address. The issue arises when developers would like to test the pods. Previous IP given to the developers wont work as the new pod is assigned a new random IP.
This issue can be solved with kubernetes service.

## Kubernetes Service
Abstraction that provides network access to pods. Kubernetes serves multiple functionalities listed below:

### Load balancing
Instead of having multiple pods with random IP that users can access. Users are given the service IP instead. Using the previous example, kubernetes service acts as a load balancer, depending on the number of users/requests, users will access different assigned pods.

### Service Discovery
Service acts on top of the deployments. It doesn't keep track of the IP addresses of the pods when one is deleted / created. Instead is uses labels of the pods. We specify the labels in the metadata portion of the deployment.yaml file.



