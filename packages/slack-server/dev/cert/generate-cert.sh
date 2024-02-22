openssl req  -nodes -new -x509  \
    -keyout ./server.key \
    -out ./server.cert \
    -subj "/C=US/ST=State/L=City/O=company/OU=Com/CN=www.testserver.local"
