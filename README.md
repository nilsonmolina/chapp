# Chapp
**Site:** [http://www.chapp.ml](http://www.chapp.ml)  

Chapp is a chat application utilizing websockets for realtime communications. Chapp was built
with React in the frontend and NodeJs/ExpressJS in the backend.  The backend server is hosted on 
an AWS EC2 Ubuntu instance, it uses an Nginx reverse proxy for load balancing and handling of HTTPS, 
socket.IO for easier handling of websockets and it's fallbacks, Redis as a stateful datastore used 
by stateless and clustered NodeJS servers, PM2 for production level stability and monitoring, and 
I also wrote a few bash scripts to automate the build and deploy workloads. It was a project I 
undertook to get hands on practice on all the stages of the development process. So while a chat app 
may seem a bit simple, the process of setting up a microservices architecture is quite complex and 
it was a very interesting challenge for me to solve. Also, working with websockets posed a few
challenges compared with a basic REST API, especially when using a reverse proxy.
