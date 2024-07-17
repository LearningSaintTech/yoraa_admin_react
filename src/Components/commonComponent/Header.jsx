import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLogout } from '../../Components/authComponent/Logout'; 
import '../../css/Header/Header.css'; 

const Header = () => {
    const user = useSelector(state => state.auth.user); 
    const dispatch = useDispatch();

    const handleLogout = useLogout(); 

    if (!user) return null;

    return (
        <header>
            <nav>
                <ul>
                    <li><a href="/profile">Profile</a></li>
                    <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
