import React, { useEffect, useState } from 'react';
import './Card.css';
import axios from 'axios';
import { URL_ESPECIES, URL_EVOLUCIONES, URL_PPOKEMON } from '../../../assets/api/apiRest';

function Card({ card }) {
    const [itemPokemon, setItemPokemon] = useState({});
    const [especiePokemon, setEspeciePokemon] = useState({});
    const [evoluciones, setEvoluciones] = useState([]);
    // Obtener datos del Pokémon
    useEffect(() => {
        const dataPokemon = async () => {
            if (card?.url) {
                const api = await axios.get(card.url);
                setItemPokemon(api.data);
            }
        };
        dataPokemon();
    }, [card]);
    // Obtener información de la especie del Pokémon
    useEffect(() => {
        const dataEspecie = async () => {
            const pokemonId = itemPokemon?.id;
            if (pokemonId) {
                const api = await axios.get(`${URL_ESPECIES}/${pokemonId}`);
                setEspeciePokemon({
                    url_especie: api?.data?.evolution_chain,
                    data: api.data,
                });
            }
        };
        dataEspecie();
    }, [itemPokemon]);
    // Obtener las evoluciones del Pokémon
    useEffect(() => {
        const obtenesEvoluciones = async () => {
            if (especiePokemon?.url_especie?.url) {
                const arrayEvoluciones = [];
                const URL = especiePokemon.url_especie.url.split('/');
                const api = await axios.get(`${URL_EVOLUCIONES}/${URL[6]}`);
                const getPokemonImagen = async (id) => {
                    const response = await axios.get(`${URL_PPOKEMON}/${id}`);
                    return response?.data?.sprites?.other['official-artwork']?.front_default;
                };
                // Primera evolución
                const species1 = api?.data.chain?.species;
                if (species1) {
                    const img1 = await getPokemonImagen(species1.url.split('/')[6]);
                    arrayEvoluciones.push({
                        img: img1,
                        name: species1.name,
                    });
                }
                // Segunda evolución
                const species2 = api?.data.chain?.evolves_to[0]?.species;
                if (species2) {
                    const img2 = await getPokemonImagen(species2.url.split('/')[6]);
                    arrayEvoluciones.push({
                        img: img2,
                        name: species2.name,
                    });
                }
                // Tercera evolución
                const species3 = api?.data.chain?.evolves_to[0]?.evolves_to[0]?.species;
                if (species3) {
                    const img3 = await getPokemonImagen(species3.url.split('/')[6]);
                    arrayEvoluciones.push({
                        img: img3,
                        name: species3.name,
                    });
                }
                setEvoluciones(arrayEvoluciones);
            }
        };

        obtenesEvoluciones();
    }, [especiePokemon]);
    let pokeId = itemPokemon?.id?.toString() || '';
    if (pokeId.length === 1) {
        pokeId = '00' + pokeId;
    } else if (pokeId.length === 2) {
        pokeId = '0' + pokeId;
    }
    return (
        <div className='card'>
            <img
                className='img-poke'
                src={itemPokemon?.sprites?.other?.['official-artwork']?.front_default}
                alt={itemPokemon.name || 'pokemon'}
            />
            <div className='subcard'>
                <div className='nombre-info'>
                    <strong className='id'>{pokeId}</strong>
                    <strong className='nombre'>{itemPokemon?.name}</strong>
                    <h4 className='altura'>Altura: {itemPokemon?.height}cm</h4>
                    <h4 className='peso'>Peso: {itemPokemon?.weight}kg</h4>
                    <h4 className='habitat'>
                        Habitat: {especiePokemon?.data?.habitat?.name || 'Unknown habitat'}
                    </h4>
                </div>
                <div className='habilidades'>
                    <h4 className='h4-habildiades'>Habilidades</h4>
                    {itemPokemon?.stats?.map((sta, index) => (
                        <h6 key={index} className='item-habi'>
                            <div className="nombre-habilidades">
                            <span>{sta.stat.name}</span>
                            </div>
                            
                            <progress  value={sta.base_stat} max={110}></progress>
                            <span className='numero-habilidades'> {sta.base_stat}</span>
                        </h6>
                    ))}
                </div>
                <h4 className='tipo-poke'>Tipo de Pokemon</h4>
                <div className='tipos'>
                    
                    {itemPokemon?.types?.map((ti, index) => (
                        <h6 key={index}>{ti.type.name}</h6>
                    ))}
                </div>
                <div className='evoluciones'>
                    <h4 className='h4-evolucion'>Evoluciones</h4>
                    <div className="imagenes">
                        <div className="evolucion">
                            {evoluciones.map((evo, index) => (
                                <div key={index} className='evo-item'>
                                    <img src={evo.img} alt={evo.name} className='evo-img' />
                                    <span className='texto-evo'>{evo.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Card;
