import React from 'react';
import Footer from './Footer';
import Header from './Header';

const Layout = ({ children }) => {
    return (
        <div className='bg-[#f5f5f5]'>
            <Header />
            <main style={{ minHeight: '80vh', padding: '20px' }}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
