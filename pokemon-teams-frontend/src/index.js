const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`
const main = document.querySelector('main')
const configObj = (type, bodyObj) => { 
    object = {
    method: type,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"},
    body: JSON.stringify(bodyObj) }
    return object
}

window.addEventListener('DOMContentLoaded', () => {

    const getTrainers = () => fetch(TRAINERS_URL).then(resp => resp.json()).then(json => renderAllTrainers(json))
    const renderAllTrainers = (trainersArray) => trainersArray.forEach(trainer => main.append(renderTrainer(trainer)))

    const createP = (trainer, card) => {
        const p = document.createElement('p')
        p.innerText = trainer.name
        card.append(p)
    }

    const listPokemon = (trainer, card) => {
        const ul = document.createElement('ul')
        trainer.pokemons.forEach(pokemon => renderPokemon(pokemon, ul, trainer))
        card.append(ul)
    }

    const renderPokemon = (pokemon, ul, trainer) => {
        const li = document.createElement('li')
        const button = document.createElement('button')
        li.innerText = `${pokemon.nickname} (${pokemon.species})`
        button.className = 'release'; button.innerText = 'Release'
        button.addEventListener('click', () => releasePokemon(pokemon, trainer))
        li.append(button)
        ul.append(li)
    }

    const createButton = (trainer, card) => {
        const button = document.createElement('button')
        button.innerText = "Add Pokemon"
        button.addEventListener('click', (e) => addPokemon(e, trainer))
        card.append(button)
    }

    const addPokemon = (e, trainer) => {
        if (trainer.pokemons.length > 5) {
            console.log("You already have 6 - that's the max")
        } else { 
            const body = {trainer_id: trainer.id}
            fetch(POKEMONS_URL, configObj('POST', body))
            .then(resp => resp.json())
            .then(() => reRenderTrainer(trainer)) 
        }
    }

    const releasePokemon = (pokemon, trainer) => {
        fetch(`${POKEMONS_URL}/${pokemon.id}`, configObj('DELETE', null))
        .then(resp => resp.json())
        .then(() => reRenderTrainer(trainer))
    }

    const reRenderTrainer = (trainer) => {
        fetch(`${TRAINERS_URL}/${trainer.id}`)
        .then(resp => resp.json())
        .then(json => {
            replace = document.querySelector(`#${trainer.name}${trainer.id}`)
            main.replaceChild(renderTrainer(json), replace)
        })
    }

    const renderTrainer = (trainer) => {
        const card = document.createElement('div')
        card.id = `${trainer.name}${trainer.id}`
        card.className = 'card'

        createP(trainer, card)
        createButton(trainer, card)
        listPokemon(trainer, card)
        return card
    }

    getTrainers()
})