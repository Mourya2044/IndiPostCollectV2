import React from 'react'

const Navbar = () => {
  return (
    <nav className='display-flex flex-col justify-between align-center'>
        <ul className="nav-menu">
            <li><a href="/" className="logo">IndiPostCollect</a></li>
        </ul>
        <ul className="nav-menu">
            <li><a href="/learn">Learn</a></li>
            <li><a href="/community">Community</a></li>
            <li><a href="/museum">Museum</a></li>
            <li><a href="/marketplace">Marketplace</a></li>
            <li><a href="/events">Events</a></li>
        </ul>
        <ul className="nav-menu">
            <li><a href="/cart">Cart</a></li>
            <li><a href="/user">User</a></li>
            <li><a href="/logout">Logout</a></li>
            <li><a href="/login">Login</a></li>
        </ul>
    </nav>
  )
}

export default Navbar