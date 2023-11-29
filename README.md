## TBD more - soon
 
 Start:
 1. Inform how to add new host to host file.
 2. Docker + kubernetes up and runnig
 3. Nginx server in kubernetes cluster up and runnig
 4. Add env variables in kubernetes
 Open your command line and paste:
  `kubectl create secret generic jwt-secret --from-literal=JWT_KEY=yourSecretHere`
  kubernetes should return: secret/jwt-secret created

  to check all secrets use:
  `kubectl get secrets`
 5. Install skaffold
 Running dev with hot reload - `skaffold dev`

 ## How to comunicate with ngnix service within pod?
 Check name of service inside ingress-nginx namespace
 `kubectl get services -n ingress-nginx` // ingress-nginx-controller

 url: http://ingress-nginx-controller.ingress-nginx.svc.cluster.local

optional:
 To do not remember this url you can create External Name Service that 
 can redirect to this crazy url from ex. http:/ingress-nginx-srv