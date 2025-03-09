import React from 'react';
import Footer from './Footer';
import Header from './Header';

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <main style={{ minHeight: '80vh', padding: '20px' }}>
                {children}
            </main>
            <Footer />
        </>
    );
};

export default Layout;
