import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import './LayoutHome.css';
import axios from 'axios';
import * as FaIcons from 'react-icons/fa';
import { URL_PPOKEMON } from '../../../assets/api/apiRest';
import Card from '../Card/Card';

export default function LayoutHome() {
    const [arrayPokemon, setArrayPokemon] = useState([]);
    const [globalPokemon, setglobalPokemon] = useState([]);
    const [xpage, setXpage] = useState(1);
    const [buscar, setBuscar] = useState('');
    const [selecioneFil, setSelecioneFil] = useState('');

    useEffect(() => {
        const api = async () => {
            const limit = 9;
            const xp = (xpage - 1) * limit;
            const apiPoke = await axios.get(`${URL_PPOKEMON}/?offset=${xp}&limit=${limit}`);
            setArrayPokemon(apiPoke.data.results);
        };
        api();
        getGlobalPokemon();
    }, [xpage]);

    const getGlobalPokemon = async () => {
        const res = await axios.get(`${URL_PPOKEMON}?offset=0&limit=1000`);
        const promises = res.data.results.map((pokemon) => pokemon);
        const result = await Promise.all(promises);
        setglobalPokemon(result);
    };

    const filterPokemon =
        buscar.length > 0
            ? globalPokemon?.filter((pokemon) => pokemon?.name?.includes(buscar))
            : arrayPokemon;

    const obtenerBusqueda = (texto) => {
        setBuscar(texto.toLowerCase());
        setXpage(1);
    };

    return (
        <div className='layout'>
            <Header obtenerBusqueda={obtenerBusqueda} />
            <section className='paginacion'>
                <div className='div-paginacion'>
                    <span
                        className='izquierda'
                        onClick={() => {
                            if (xpage === 1) {
                                return console.log('Es el primero');
                            }
                            setXpage(xpage - 1);
                        }}
                    >
                        <FaIcons.FaAngleLeft />
                    </span>
                    <span className='item-p'>{xpage}</span>
                    <span className='item-p'>De</span>
                    <span className='item-p'>
                        {globalPokemon.length > 0 ? Math.ceil(globalPokemon.length / 9) : 1}
                    </span>
                    <span
                        className='derecha'
                        onClick={() => {
                            if (xpage === Math.ceil(globalPokemon.length / 9)) {
                                return console.log('Es el último');
                            }
                            setXpage(xpage + 1);
                        }}
                    >
                        <FaIcons.FaAngleRight />
                    </span>
                </div>
            </section>
            <div className='card_contenido'>
                {filterPokemon.map((card, index) => (
                    <Card key={index} card={card} />
                ))}
            </div>
        </div>
    );
}
