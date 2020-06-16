# Install istio

The commands bellow are based on the official [documentation](https://istio.io/latest/docs/setup/getting-started/)

In the master node execute the command bellow
```bash
curl -L https://istio.io/downloadIstio | sh -

cd istio-1.6.2
```

The folder above can change according to the version downloaded

```bash
export PATH=$PWD/bin:$PATH
istioctl install --set profile=demo
```

The command above will deploy istio applications considering the demo profile

```bash
kubectl label namespace default istio-injection=enabled
kubectl apply -f samples/bookinfo/platform/kube/bookinfo.yaml
```

The command above will deploy the bookinginfo application. Test if the application is running, the response on the console will be **< title >Simple Bookstore App< / title >**

```bash
kubectl exec -it $(kubectl get pod -l app=ratings -o jsonpath='{.items[0].metadata.name}') -c ratings -- curl productpage:9080/productpage | grep -o "<title>.*</title>"
```

Now deploy the gateway to enable external access

```bash
kubectl apply -f samples/bookinfo/networking/bookinfo-gateway.yaml
istioctl analyze
kubectl get svc istio-ingressgateway -n istio-system
```
The output of the last command above will show that the ingress gateway don't have external IP address, to make it easier let's use nodeport for testing

Find the nodeport behind 80, e.g: `80:30169/TCP`

Go to AWS and enable on the security group all traffic to this http port (if you configured like in this [file](setup_aws.md) you don't need to do this)

### Testing the application

On the aws console select the masternode and get the IPV4 Public IP address and open a browser and type:

`http://externalipaddress_fromec2instance:nodeport_fromabove/productpage`

E.g.: http://35.172.216.112:30169/productpage

Open a new console and execute this line

### Creating some traffic to see istio features
Open a console in your machine and execute
```bash
while sleep 5; do curl --request GET http://35.172.216.112:30169/productpage; done;
```
*Tip:* This ip address is the public IP Address of your ec2 machine

This command line will generate one request every five seconds

### Accessing istio features

When we deployed the istio whe choose the option `profile=demo` that deployed some extra features that you can see int this [link](https://istio.io/latest/docs/setup/additional-setup/config-profiles) on the demo column

> Let's access Kiali

`kubectl get svc -n istio-system | grep kiali`

Get the node port and expose it

`kubectl port-forward svc/kiali 20001:20001 -n istio-system --address 0.0.0.0`

Open http://35.172.216.112:20001/ on your browser. User and password are admin

> Let's access Jaeger

`kubectl get svc -n istio-system | grep jaeger`

Get the node port from jaeger-query

`kubectl port-forward svc/jaeger-query 16686:16686 -n istio-system --address 0.0.0.0`

*address: 0.0.0.0* > will bind to all ip addresses



