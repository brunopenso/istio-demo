# Istio DEMO on AWS Provider

The objective of this repo is to create a kubernets cluster to play with istio services.

## Create your environment

- Set up AWS, click [here](setup_aws.md)
- Set up Kubernets, click [here](setup_kubernetes.md)
- Set up Istio, click [here](setup_istio.md)

Tips:
- Remover to stop all EC2 machine to avoid extra costs

## Util

> Connect to EC2 Instance

First: `chmod 400 istiodemo.pem`

Then: `ssh -i "istiodemo.pem" ubuntu@<name>.compute-1.amazonaws.com`
