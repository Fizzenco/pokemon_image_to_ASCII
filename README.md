# Aplicación de Pokemon para convertir la imagen a ASCII

## Empezando

1. Instala GraphicsMagick:
   
   Ejecuta en consola los siguientes comandos:
   
   ```
      sudo apt update
   ```
   
   ```
      sudo apt install graphicsmagick
   ```

0. Instala los paquetes necesarios con este código:

```bash
  npm i core-node-pokemon
```

1. Ejecuta:

```bash
  npm run start:pokedex
```
2. busca el pokemon que quieras.

3. El programa va a pedir a POKEAPI los datos del pokemon (nombre, estadísticas, peso, altura...)

4. El programa, con el número de la pokedex del pokemon, puede completar la URL de la página oficial de pokemon, así obteniendo la imagen del pokemon.

5. Se usa la librería img2ascii para convertir la imagen a formato ASCII

