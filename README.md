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



