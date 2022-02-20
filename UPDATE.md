# Actualizaciones

Pasos para actualizar el codigo fuente

1. Verificar que se encuentra en la rama `master`.

```sh
$ git branch
* master
  develop
```

> Si no esta en la rama master cambiar de rama con `git checkout master`

2. (opcional) Guardado provisional si es que se hicieron cambios en el codigo.

```sh
$ git fetch
```

3. Obtener los nuevos cambios desde el repositorio principal.

```sh
$ git pull origin master
```

4. Instalar nuevas dependencias de paquetes.

```sh
$ npm install
```

5. Generar los archivos compilados.

```sh
$ rm -R dist
$ npm run build
```

> Si el comando se ejecuta correctamente debe crearse una carpeta `dist` con los archivos compilados

6. Desplegarlo en producción.

```sh
$ mv produccion produccion.20190522
$ mv dist produccion
```
