import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <div>
            <footer className="container-fluid text-center footer">
                <p>© Made by Jindouz (2024)</p>
                <Link to='/about'><div style={{ marginTop: '-9px' }}>About</div></Link>
            </footer>
        </div>
    );
}

export default Footer;
