import React from 'react'
import logo from '../../../assets/logo-pokemon.png'
import'./Header.css'
import * as FaIcons from 'react-icons/fa';
export default function Header({obtenerBusqueda}) {
    
    return (
        <nav className='Menu'>
            <div className='header'>
                <div className='logo'>
                    <img src={logo} alt="" />
                </div>
                <div className='busqueda'>
                    <div className='lupa'>
                    <FaIcons.FaSearch/>
                    </div>
                    <input type="search" onChange={e => obtenerBusqueda(e.target.value)} />
                </div>
            </div>
        </nav>
    )
}
