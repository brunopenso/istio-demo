# Setup Kubernets

Step by step to setup the kubernets cluster

## Steps for each machine that will be on the cluster
<details>
    <summary>Details here</summary>

Access each machine that will be part of the cluster and execute the steps bellow in root mode `sudo su`

**Docker config**
```bash
curl -fsSL https://get.docker.com | bash
sudo usermod -aG docker ubuntu
docker --version
```

**Install kubernets**
```bash
echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" > /etc/apt/sources.list.d/kubernetes.list

curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -

apt-get update

apt-get install kubelet kubectl kubeadm
```
</details>

## Configure the master node
Connect to the EC2 

```bash
kubeadm config images pull

kubeadm init
```
*Tip:* Save the output of the command for future use **kuveadm join xxxx**

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

kubectl apply -f  "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version| base64 | tr -d '\n')".yaml
```

## Join nodes to master

Now we will add nodes to the master node. 

Steps:
1. Check if this new node is in the same security group
1. Check if the security groups has enable all traffic in the same security group 
   - if you are using different security group for each machine you will need to enable All Traffic between than
1. Execute the command bellow to join the master node
   - the command bellow you can get after the init of the master node

```bash
kubeadm join <ip>:<port> --token <token> \
    --discovery-token-ca-cert-hash sha256:<sha> 
```

## Validation

Wait 2/3 minutes and execute 

```bash
kubectl get nodes
```

You should see something like this:

|NAME           |   STATUS  |   ROLES  |  AGE  |   VERSION |
|-|-|-|-|-|
|ip-XXX-XX-XX-XX |  Ready    |  master |  4m23s |  v1.18.3 |
|ip-YYY-YY-YY-YY |  Ready |  < none > |  104s    |  v1.18.3 |