docker build . -t verify-link-server

docker run -p 49160:8080 verify-link-server