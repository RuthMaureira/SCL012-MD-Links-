# Markdown Links

## Índice

* [1. Preámbulo](#1-preámbulo)
* [2. Diagrama de Flujo](#2-resumen-del-proyecto)
* [3. Instalación](#3-instalacion)
* [4. Modo de Uso](#4-uso)
* [5. Screenshot](#5-screen)

***

## 1. Preámbulo

Hoy en día, añadir enlaces a una publicación es común y se podría decir casi obligatorio, especialmente cuando se exponen trabajos en base a referencias, y en ocasiones sucede que con el tiempo ya no son válidos, perjudicando el valor de la información que se busca compartir.

Markdown Links es una libreria que analiza archivos en formato markdown (provenientes de directorios o directamente de un archivo), a los cuales se les extrae cada link para mostrar su información (archivo del que se extrae, url del link y texto que lo acompaña), validar si link funciona (status de respuesta recibida al hacer petición HTTP y texto de status 'ok/fail') u obtener estadísticos como número de links únicos, fallidos y totales, según se requiera.

## 2. Diagrama de Flujo

![Flujo](https://github.com/RuthMaureira/SCL012-MD-Links-/blob/development/img/diagramajpg.jpg)

## 3. Instalación

```
npm install rm-md-links
```

## 4. Uso

En terminal:

```
md-links <path-to-file> [options]
```

### Argumentos

* `path`: Ruta absoluta o relativa al archivo o directorio. Si la ruta pasada es
  relativa, debe resolverse como relativa al directorio desde donde se invoca
  node - _current working directory_).
* `options`: Un objeto con las siguientes propiedades:
  - `--validate`: Booleano que determina si se desea validar los links
    encontrados.
  - `--stats`: Booleano que determina si se desean estadísticos de links
    encontrados.

### Ejemplos

#### Caso 1: default

Capturar links de archivo(s) junto con ruta del archivo donde aparece y texto que hay dentro del link (truncado a 50 caracteres).

```sh
$ md-links ./some/example.md
./some/example.md http://algo.com/2/3/ Link a algo
./some/example.md https://otra-cosa.net/algun-doc.html algún doc
./some/example.md http://google.com/ Google
```


#### Caso 2: validate

Se hace petición HTTP para averiguar si el link funciona o no. Se entrega status y texto ok/fail, según corresponda.

```sh
$ md-links ./some/example.md --validate
./some/example.md http://algo.com/2/3/ ok 200 Link a algo
./some/example.md https://otra-cosa.net/algun-doc.html fail 404 algún doc
./some/example.md http://google.com/ ok 301 Google
```


#### Caso 3: stats 

Se entrega texto con estadísticas básicas sobre los links.

```sh
$ md-links ./some/example.md --stats
Total: 3
Unique: 3
```

#### Caso 4: validate y stats

Se obtienen estadísticas que necesitan de los resultados de la validación.

```sh
$ md-links ./some/example.md --stats --validate
Total: 3
Unique: 3
Broken: 1
```

## 4. Screenshot

#### Revisión argumentos

![Flujo](https://github.com/RuthMaureira/SCL012-MD-Links-/blob/development/img/argumentos.jpg)

#### Validación

![Flujo](https://github.com/RuthMaureira/SCL012-MD-Links-/blob/development/img/validatejpg.jpg)
