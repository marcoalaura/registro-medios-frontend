# install dependencies
npm install

# DESARROLLO - serve with hot reload at localhost:8080
npm run dev

# TEST - serve with hot reload at localhost:8080
npm run start-test

# PRODUCCION - build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report


Para ambientes de test y producción instalar servidor APACHE y NGINX con proxy reverso. 

Copiar la carpeta generada dist a la ruta del directorio web /var/www/html/pauteo

El archivo ejemplo de la configuración nginx es el siguiente:

```
server {
    listen       80;
    listen [::]:80 default_server;
    server_name  _;
    location / {
        root   /var/www/html;
        index  index.html index.htm;
    }
    # se expone por http://localhost/pauteo-backend/
    location /pauteo-backend/ {
      # rewrite ^/pauteo-backend(.*) $1 break;
      proxy_pass         http://localhost:3000/;
      proxy_redirect     off;
      proxy_set_header   Host $host;
      proxy_set_header   X-Real-IP $remote_addr;
      proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header   X-Forwarded-Host $server_name;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
    ssi on;
}
```
Se precisa configurar para que el sistema permita subir documentos de hasta Mega Bytes.
```
server {
    ...
    client_max_body_size 5M;
}
```