# Setup AWS

Step by step to setup AWS

1. Create two(2) ubuntu EC2 machines with this hardware **t2.medium**
1. Choose the same security group for both machines
1. Download the pem file to your local machine

## Create EC2 machine

- Create two(2) ubuntu EC2 machines with this hardware **t2.medium**
- Select the vpc default
- Select a existing key par or create a new one

## Security group config

Access the security group on the EC2 page

### launch-wizard-1 - inbound rules

|Type  |Protocol  |Port range  |Source  |
|-|-|-|-|
|All Traffic  |All  |All  |launch-wizard-1  |
|SSH          |TCP  |22     |0.0.0.0/0  | 
|Custom TCP   |TCP  |16000-33000  |my.external.ip/32  |
