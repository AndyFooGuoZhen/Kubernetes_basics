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

#### Log in to access a cluster and run the application
```
minikube ssh
```
Then do curl <IP Address of pod> to access application in pod

### Getting IP of minikube cluster
```
minikube ip
```

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

#### Create a service 
```
kubectl apply -f <name of service.yaml file>
```

#### Create an ingress resource 
```
kubectl apply -f <name of ingress.yaml file>
```

### Get kubernetes services
```
kubectl get svc
```

### Get Kubernetes ingress
```
kubectl get ingress
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

### Exposing application outside of kubernetes cluster 

### 3 types of services 
1. Via cluster IP : Application are only accesible within the cluster. Only users that have access to kubernetes cluster can access the application.
2. Node port : allows application to be accessed by inside organization (IP address of worker node is accesible)
3. Load balancer : Expose application to external world. Kubernetes uses CCM to talk with underlying cloud provider to obtain public IP address to expose application to the public.

### Creating deployment with docker images
1. Once a dockerfile is created, build a docker image with name and tag
2. Copy kubernetes deployment template from online documentation and change labels to your liking
3. In the spec section of the deployment.yml file, include the image and tag name of the docker image created (Integration with docker images)
4. Set containerPort to match with ports exposed in Dockerfile
5. Build the kubectl deployment resource

### Creating a service (with Nodeport option) 

Example service.yml
```
apiVersion: v1
kind: Service
metadata:
  name: frontend-app-service
spec:
  type: NodePort
  selector:
    app: frontend-app
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
      nodePort: 30008
```

1. Create a service.yml file
2. Copy nodeport service template from kubernetes documentation
3. in metadata of service file, name can be any name you want to name your service
4. in selector section of service file, the name must match the labels in the template section of deployment.yml
5. Replace  app.kubernetes.io/name: MyApp with app: <labelname> from deployment.yml
6. Change target port to port for application , EX: react app : 3000
7. Change port to 3000, save the service.yml file and run it via the kubectl apply -f <service.yml> command
8. On normal scenario, http://<minikubeIP>:<nodePort> would show the running application in the browser. The application is only accesible on the developer's browser as only the Nodeport is used. Skip to step 11 if this works. Else, refer to step 9 and 10 instead.
9. Using minikube however, Nodeport seems to be hidden and not exposed to the browser. More information regarding this issue can be found here : https://stackoverflow.com/questions/76470764/why-i-cant-get-access-to-app-from-browser-with-kubernetes-minikube
10. Running this command would expose your NodePort
    ```
    minikube service <serviceName>
    ```

### Expopsing a service to public (with Loadbalancer option)
NOTE : LoadBalancer wont work on minikube and will only work on cloud providers (EC2, etc)

1. Refer to previous steps for creating a service
2. Change Type of Nodeport to LoadBalancer
3. If you have an existing service with NodePort mode, edit service via this command :
```
kubectl sedit svc <servicename>
```
5. Change type from NodePort to LoadBalancer

### Ingress
Problem 1: When developers migrate legacy applications from VM to kubernetes, they are using enterprise level load balancers (Ngnix, F5) that offers advanced load balancing capablities (Ratio based, Sticky session - where one request and associated request from one user is directed to only one application, whitelisting, blacklisting). Loadbalancer offered by service in kubernetes is too basic as it uses Round Robin (FIFO).

Problem 2: For large organizations using 1000's of services in loadbalancer mode, cloud provider charges a hefty amount as each service is assigned a static load balancer IP. Before migration, developers only have one load balancer with their IP exposed, path is added to direct to specific application within the VM.

Solution : Kubernetes come up with ingress resource. Developers can config their ingress resource to have different types of load balancing. But logic for loadbalancing is then controlled by a ingress controller (just like how a pod is managed by a kubelet or service is managed by kubeproxy), the ingress controller is built by load balancer provider such as nginx and F5. Developer's have to also deploy the ingress controller by referring to the load balancer's provider for documentation and specific instructions. In short, developer has to come up with ingress resource (a .yaml file), and developer finds the implementation of the load balancer from providers to deploy.

### Creating an ingress resource
1. Make a file named ingress.yml
2. Copy and paste host based template from kubernetes ingress, change metadata name to ingress name, change service name to name of your service , and port to configured port
   ```
   apiVersion: networking.k8s.io/v1
    kind: Ingress
    metadata:
      name: ingress-wildcard-host
    spec:
      rules:
      - host: "foo.bar.com"
        http:
          paths:
          - pathType: Prefix
            path: "/bar"
            backend:
              service:
                name: service1
                port:
                  number: 80
      ```
 3. In this host-based ingress resource, we specify that users will visit foo.bar.com/bar to navigate to the main page of the application.
 4. Having the ingress resource setup wont make ingress work, we still need to install and manager our ingress controller. Kubectl get ingress will return inngress without an IP address Refer to https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/
  for more details on installation.
 6. We will install nginx ingress controller with minikube for this tutorial. Resource : https://kubernetes.io/docs/tasks/access-application-cluster/ingress-minikube/
 7. to check if ingress controller is synced with ingress resource, use command:
    
  ```
  # To check ingress-controller name
  kubectl get pods -n ingress-nginx

  # To check if ingress resouces is synced
  kubectl logs ingress-nginx-controller-7c6974c4d8-h4lcb -n ingress-nginx

  # Once the command is ran, scroll down json file to see if ingress-example       (or name of ingress ) can be found
  ```
8. Once that is done, do kubectl get ingress, the IP address will be attached. On production, the step ends here. Refer to steps 9 and more when working with minikube (localhost). 
9. On localhost (when using minikube), we need to configure the mapping between the domain to the IP. We mock the behavior of having a purchased domain name
10. Use this command to performing mapping of IP and paste the mapping into the file
    ```
    sudo nano /etc/hosts

    # Paste IP mapping
    192.168.49.2 <name of host>
    
    ```
11. Even with this done, you cant access the domain-based website on browser. Only by doing minikube ssh , and using the curl http://<domain>/path command you can test to see if it works. More details : https://stackoverflow.com/questions/66275458/could-not-access-kubernetes-ingress-in-browser-on-windows-home-with-minikube




    
  
  













