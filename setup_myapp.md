# Setup my application

To get a little bit deeper on the istio concepts I create a some applications to see how it will work and how I need to develop this applications.

On the docker folder I have a **product** and **productDetails** simulating in a very simple way 2 microsservices.

The **product** retrieve a list of products and the related description making some calls to **productDetails** to retrieve the product description

All the code is it simple as it should. This is not a production ready code.

## Build docker and push

This step you can avoid and just use my images on https://hub.docker.com/u/brunopenso

```bash
docker build -t brunopenso/istiodemo_product:1.0 .
docker build -t brunopenso/istiodemo_productdetail:1.0 .
```

To push the image use
```bash
docker login
docker push brunopenso/istiodemo_product
docker push brunopenso/istiodemo_productdetail
```

## Deploy to our kubernets cluster

