const fs = require("fs");
const axios = require("axios");

//const path = require ("path");

const env = require("dotenv").config({
  path: `${process.cwd()}/.env`,
});

const { POKEMON_URL } = env.parsed ;

class Busquedas {
  historial = [];
  pokemon_history = `${process.cwd()}/src/pokedex/db/database.json`

  constructor() {
    this.leerDB();
  }

  get historialCapitalizado() {
    // Este técnica pone en mayusculas cada primera palabra de un elemento del array
    // Ejemplo: chiQUITO de LA CALzAda -> Chiquito De La Calzada
    return this.historial.map((pokemon) => {
      let palabras = pokemon.split(" ");
      palabras = palabras.map((p) => p[0].toUpperCase() + p.substring(1));

      return palabras.join(" ");
    });
  }

  async pokemon_specs( pokemon ) {
    try {
      // Petición http a la API POKEAPI
      const instance = axios.create({
        baseURL: `${POKEMON_URL}${pokemon}`
      });
      
      // Extraemos los metadatos procesados de la petición a la API, en formato objeto
      const axios_input = await instance.get();
      
      // Los metadatos de la API de axios tiene distintos datos (código de estado, headers, url pedida, milisegundos de la quety...)
      // Solo nos interesan los datos (la 'data' de la instancia)
      let pokemon_data = axios_input.data;

      // Los pokemon pueden tener más de un tipo. 
      // Si permitimos que, en ciertos casos, nuestro programa lea dos tipos cuando solo existe uno, todo el resultado (nombre, tipo, estadisticas, peso, altura)
      // se pierde, ya que el mensaje TypeError se activa (lee algo que es undefined) y el catch (error) se activa
      // Si el segundo tipo no existe en ( pokemon_data ), queremos que no devuelva nada.
      let pokemon_type = "";
      if ( typeof( pokemon_data.types[1] ) !== 'undefined') 
      {
        pokemon_type = pokemon_data.types[1].type.name
      } 
      else { "" };

      let numero_pokemon = (pokemon_data.id).toString();
      
      // Si todo está correcto, este método devuelve un OBJETO con key values (nombre, tipo, peso, altura, hp...)
      return  {
        nombre: pokemon_data.name,
        numero_pokedex: `${'0'.repeat(3-(numero_pokemon.length))}${numero_pokemon}`,
        tipo: `${pokemon_data.types[0].type.name} ${pokemon_type}`,
        hp: pokemon_data.stats[0].base_stat,
        ataque: pokemon_data.stats[1].base_stat,
        defensa: pokemon_data.stats[2].base_stat,
        ataque_especial: pokemon_data.stats[3].base_stat,
        defensa_especial: pokemon_data.stats[4].base_stat,
        velocidad: pokemon_data.stats[5].base_stat,
        peso: pokemon_data.weight,
        altura: pokemon_data.height
      };
      
    } catch (error) {
      //console.log("Errors", error);
      return [];
    }
  }

  agregarHistorial(pokemon /* = "" */) {
    if (this.historial.includes(pokemon.toLocaleLowerCase())) {
      return;
    }
    //Solo se mantiene un historial de 5 elementos (leyendo desde el index 0 y considerando los 5 elementos siguientes)
    this.historial = this.historial.splice(0, 5);

    // Se agrega al inicio del historial la última búsqueda (5 + 1 = 6)
    this.historial.unshift(pokemon.toLocaleLowerCase());

    // Grabar en DB
    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };

    // Se escribe en nuestro historial local (pokemon_history = database.json) los cambios realizados en (agregarhistorial)
    //  Transformamos el objeto en JSON (es una buena prácrica por temas relacionados con compatibilidad entre programas / lenguajes)
    fs.writeFileSync(this.pokemon_history, JSON.stringify(payload));
  }

  leerDB() {
    //Si no existe un historial, se termina este método
    if (!fs.existsSync(this.pokemon_history)) return;

    const info = fs.readFileSync(this.pokemon_history, { encoding: "utf-8" });
    // Se convierte el JSON en objeto y accedemos a su key value ( historial )
    const data = JSON.parse(info);
    this.historial = data.historial;
  }
}

module.exports = Busquedas;
