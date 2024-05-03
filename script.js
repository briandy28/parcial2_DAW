// Elementos del DOM
//para buscar
const UrlConsulta = "https://pokeapi.co/api/v2/pokemon/"
const errorMessage = document.querySelector(".containerError");
const pokemonData =  document.querySelector(".containerInfo");
const searchInput = document.querySelector("#in1");
const searchButton =  document.querySelector(".buttonSearch");
const containerEvolution = document.querySelector(".containerEvolution")
const EvolButton = document.querySelector(".buttonEvolution")

//pokemon
const pokemonName = document.querySelector(".pokemon-name");
const pokemonImg =  document.querySelector(".pokemonImg")
const pokemonType = document.querySelector(".pokemonType")
const pokemonDescription = document.querySelector(".pokemonDescrition")
const pokemonAbilities = document.querySelector(".pokemonAbilities")

// Funciones para la búsqueda y presentación de información
async function searchPokemon() {
  const pokemonName = searchInput.value.trim();
  if (pokemonName) {
    try {
      const pokemonResponse = await fetch(`${apiUrl}/pokemon/${pokemonName}`);
      const pokemonData = await pokemonResponse.json();

      const pokemonSpeciesResponse = await fetch(`${apiUrl}/pokemon-species/${pokemonData.id}`);
      const pokemonSpeciesData = await pokemonSpeciesResponse.json();

      const description = pokemonSpeciesData.flavor_text_entries.find(
        (entry) => entry.language.name === "en"
      ).flavor_text.replace(/(\r\n|\n|\r)/gm, " ");

      showPokemonCard(pokemonData, description);
    } catch (error) {
      console.error("Error al buscar Pokémon:", error);
      showError();
    }
  } else {
    showError("Debes ingresar el nombre de un Pokémon para buscar.");
  }
}

function showPokemonCard(pokemonData, description) {
  pokemonData.style.display = "block";
  pokemonName.textContent = pokemonData.name;
  pokemonImg.src = pokemonData.sprites.front_default;
  pokemonType.textContent = pokemonData.types.map((type) => type.type.name).join(", ");
  pokemonDescription.textContent = description;

  pokemonAbilities.innerHTML = "";
  pokemonData.abilities.forEach((ability) => {
    const abilityElement = document.createElement("li");
    abilityElement.textContent = ability.ability.name;
    pokemonAbilities.appendChild(abilityElement);
  });

  checkEvolution(pokemonData);
}

async function checkEvolution(pokemonData) {
  const pokemonSpeciesUrl = pokemonData.species.url;
  const speciesResponse = await fetch(pokemonSpeciesUrl);
  const speciesData = await speciesResponse.json();

  if (speciesData.evolution_chain) {
    evolutionButton.style.display = "block";
    evolutionButton.addEventListener("click", async () => {
      await displayEvolutions(speciesData.evolution_chain.url);
    });
  } else {
    evolutionButton.style.display = "none";
  }
}

async function displayEvolutions(evolutionChainUrl) {
  const evolutionResponse = await fetch(evolutionChainUrl);
  const evolutionData = await evolutionResponse.json();

  let currentPokemon = evolutionData.chain;

  while (currentPokemon) {
    const pokemonName = currentPokemon.species.name;
    const pokemonResponse = await fetch(`${apiUrl}/pokemon/${pokemonName}`);
    const pokemonData = await pokemonResponse.json();

    // Mostrar la primera evolución
    pokemonName.textContent = pokemonData.name;
    pokemonImg.src = pokemonData.sprites.front_default;
    pokemonType.textContent = pokemonData.types.map((type) => type.type.name).join(", ");
    pokemonAbilities.textContent = pokemonData.abilities.map((ability) => ability.ability.name).join(", ");

    // Salir del bucle si no hay más evoluciones
    if (!currentPokemon.evolves_to.length) {
      break;
    }

    currentPokemon = currentPokemon.evolves_to[0];
  }
}

function showError(errorMessageText = "Ha ocurrido un error.") {
  errorMessage.textContent = errorMessageText;
  errorMessage.style.display = "block";
}

