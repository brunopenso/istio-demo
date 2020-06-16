# Istio DEMO on AWS Provider

The objective of this repo is to create a kubernets cluster to play with istio services.

1. Create a AWS Account
1. Create two(2) ubuntu EC2 machines with this hardware **t2.medium**
1. Choose the same security group for both machines
1. Download the pem file to your local machine
1. Choose a machine to be the master
1. Configure all stuffs

## How to connect to EC2

First: `chmod 400 istiodemo.pem`

Then:
`ssh -i "istiodemo.pem" ubuntu@<name>.compute-1.amazonaws.com`

**Tip**: If you right click in the machine on the EC2 console you can choose to connect and get this command line ready.

## Steps for each machine that will be on the cluster
<details>
    <summary>Details here</summary>

Access each machine that will be part of the cluster and execute the steps bellow

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

mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

kubectl apply -f  "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version| base64 | tr -d '\n')".yaml
```
*Tip:* Save the output of the command for future use

## Join nodes to master

Now we will add nodes to the master node. 

Steps:
1. Check if this new node is in the same security group
1. Go to the security groups and enable all traffic in the same security group 
   - if you are using different security group for each machine you will need to enable All Traffic between than
1. Execute the command bellow to join the master node
   - the command bellow you can get after the init of the master node
```bash
kubeadm join <ip>:<port> --token <token> \
    --discovery-token-ca-cert-hash sha256:<sha> 
```

## Install istio

The commands bellow are based on the official [documentation](https://istio.io/latest/docs/setup/getting-started/)

In the master node execute the command bellow
```bash
curl -L https://istio.io/downloadIstio | sh -

cd <istio-1.6.2>
export PATH=$PWD/bin:$PATH
istioctl install --set profile=demo

kubectl label namespace default istio-injection=enabled
kubectl apply -f samples/bookinfo/platform/kube/bookinfo.yaml
kubectl exec -it $(kubectl get pod -l app=ratings -o jsonpath='{.items[0].metadata.name}') -c ratings -- curl productpage:9080/productpage | grep -o "<title>.*</title>"

kubectl apply -f samples/bookinfo/networking/bookinfo-gateway.yaml
istioctl analyze

kubectl get svc istio-ingressgateway -n istio-system
```
The output of the last command above will show that the ingress gateway don't have external IP address, to make it easier let's use nodeport

Find the nodeport behind 80, e.g: `80:32633/TCP`

Go to AWS and enable on the security group all traffic to this node port

### Testing the application
Open a new console and execute this line

```bash
while sleep 2; do curl --request GET http://35.171.159.208:32633/productpage; done;
```
*Tip:* This ip address is the public IP Address of your ec2 machine

This command line will generate two request every each second to generate a lot of requests

### Accessing istio features

When we deployed the istio whe choose the option `profile=demo` that deployed some extra features that you can see int this [link](https://istio.io/latest/docs/setup/additional-setup/config-profiles) on the demo column

Let's access the Kiali.

`kubectl get svc -n istio-system | grep kiali`

Get the node port and expose it

Kiali

`kubectl port-forward svc/kiali 20001:20001 -n istio-system --address 0.0.0.0`

Jaeger
`kubectl port-forward svc/jaeger 16686:16686 -n istio-system --address 0.0.0.0`

*address: 0.0.0.0* > will bind to all ip addresses

To access this in your web browser you need to go to the EC2 security group and enable tcp custom port 20001 to your IP Address

Go to your web browser(http://35.171.159.208:20001) and log in using the user admin and password admin.

## Security group config in my demo

My EC2 machines were created in different times and I forget to use the same security group

### launch-wizard-2

|Type  |Protocol  |Port range  |Source  |
|-|-|-|-|
|All Traffic  |All  |All  |launch-wizard-2  |
|All Traffic  |All  |All  |launch-wizard-3  |
|Custom TCP   |TCP  |32633  |my.external.ip/32  |
|Custom TCP   |TCP  |20001  |my.external.ip/32  |
|SSH          |TCP  |22     |0.0.0.0/0  | 

### launch-wizard-3

|Type  |Protocol  |Port range  |Source  |
|-|-|-|-|
|All Traffic  |All  |All  |launch-wizard-2  |
|All Traffic  |All  |All  |launch-wizard-3  |
|Custom TCP   |TCP  |32633  |my.external.ip/32  |
|Custom TCP   |TCP  |20001  |my.external.ip/32  |
|SSH          |TCP  |22     |0.0.0.0/0  | 
