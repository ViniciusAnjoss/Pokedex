const pokemonName = document.querySelector('.pokemon_name');
const pokemonNumber = document.querySelector('.pokemon_number');
const pokemonImage = document.querySelector('.pokemon_image');
const pokemonType = document.querySelector('.pokemon_type');
const pokemonWeaknesses = document.querySelector('.pokemon_weaknesses');

const form = document.querySelector('.form');
const input = document.querySelector('.input_search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');


let searchPokemon = 1;

const fetchPokemon = async (pokemon) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    return data;
  }
}

const fetchPokemonType = async (typeUrl) => {
  const typeResponse = await fetch(typeUrl);
  if (typeResponse.status === 200) {
    const typeData = await typeResponse.json();
    return typeData;
  }
}

const renderPokemon = async (pokemon) => {
  pokemonName.innerHTML = 'Loading...';
  pokemonNumber.innerHTML = '';
  pokemonType.innerHTML = '';
  pokemonWeaknesses.innerHTML = '';

  const data = await fetchPokemon(pokemon);

  if (data) {
    pokemonImage.style.display = 'block';
    pokemonName.innerHTML = data.name;
    pokemonNumber.innerHTML = data.id;
    pokemonImage.src = data.sprites.versions['generation-v']['black-white'].animated.front_default;

    // Obtendo os tipos do Pokémon
    const types = data.types.map((type) => type.type.name);
    pokemonType.innerHTML = `Type: ${types.join(', ')}`;

    // Obtendo as fraquezas do Pokémon
    const weaknesses = await Promise.all(
      types.map(async (type) => {
        const typeData = await fetchPokemonType(`https://pokeapi.co/api/v2/type/${type}`);
        return typeData.damage_relations.double_damage_from.map((weakness) => weakness.name);
      })
    );

    const flattenedWeaknesses = weaknesses.flat();
    pokemonWeaknesses.innerHTML = `Weaknesses: ${flattenedWeaknesses.join(', ')}`;

    input.value = '';
    searchPokemon = data.id;
  } else {
    pokemonImage.style.display = 'none';
    pokemonName.innerHTML = 'Not found :c';
    pokemonNumber.innerHTML = '';
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  renderPokemon(input.value.toLowerCase());
});

buttonPrev.addEventListener('click', () => {
    if (searchPokemon > 1) {
      searchPokemon -= 1;
      renderPokemon(searchPokemon);
      songButtons();
    }
  });
  
  buttonNext.addEventListener('click', () => {
    searchPokemon += 1;
    renderPokemon(searchPokemon);
    songButtons();
  });
  
  function songButtons() {
    const audio = new Audio('./soms/mixkit-game-click-1114.wav');
    audio.play();
  }
  


function somTheme() {
    const audio = new Audio('./soms/8d82b5_Pokemon_Theme_Song.mp3');
    audio.loop = true;
    audio.play();
  }
  
  window.addEventListener('load', somTheme);
  

  
renderPokemon(searchPokemon);
