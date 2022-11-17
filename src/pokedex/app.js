const {
  leerInput,
  inquirerMenu,
  pausa
} = require("./helpers/inquirer");


const Busquedas = require("./models/busquedas");
const img2ascii = require("image-to-ascii");

const main = async () => {
  // Se llama a una nueva búsqueda de la clase ( Busquedas )
  const busquedas = new Busquedas();
  //let opt;

  do {
    // Se muestra el mensaje inicial, con sus 3 opciones ( buscar pokemon, historial y salir )
    opt = await inquirerMenu();
    
    switch (opt) {
      
      //Buscar ciudad
      case 1:
        // Mostrar mensaje que te pide el pokemon y escribir el pokemon
        const pokemon_nombre = await leerInput("Pokemon: ");

        // Hacer la petición API y obtener los datos del pokemon
        const selected_pokemon = await busquedas.pokemon_specs(pokemon_nombre);

        // Guardar el pokemon en DB
        busquedas.agregarHistorial(pokemon_nombre);

        if (selected_pokemon.length === 0)  {
          
          console.log ( 'x--'.repeat(16).red);
          console.log('El Pokemon que se ha buscado no se ha encontrado\n');
          console.log ( 'x--'.repeat(16).red);
          continue;
        }

        // Mostrar resultados del pokemon
        console.log("\nInformación del Pokemon\n".green);
        console.log("*-".repeat(15).green);
        console.log("Nombre:", selected_pokemon.nombre);
        console.log("Numero de la Pokedex:", selected_pokemon.numero_pokedex);
        console.log("Tipo:", selected_pokemon.tipo);
        console.log("HP:", selected_pokemon.hp);
        console.log("Ataque:", selected_pokemon.ataque);
        console.log("Ataque especial:", selected_pokemon.ataque_especial);
        console.log("Defensa:", selected_pokemon.defensa);
        console.log("Defensa especial:", selected_pokemon.defensa_especial);
        console.log("Velocidad:", selected_pokemon.velocidad);
        console.log("Peso:", selected_pokemon.peso);
        console.log("Altura:", selected_pokemon.altura);

        // Mostrar imágen, en formato ASCII, de la página oficial de pokemon
        console.log("\n");
        console.log("Foto del Pokemon:");
        
        const load_image = async () => {
          img2ascii(`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${selected_pokemon.numero_pokedex}.png`, function (err, result) 
          {
              console.log(result);
          })
        }
        load_image();
       
        break;

        //Mostrar historial
        case 2:
        busquedas.historialCapitalizado.forEach((pokemon, i) => {
          const idx = `${i + 1}.`.red;
          console.log(`${idx} ${pokemon} `);
        });

        break;
    }

    //salir del programa
    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
