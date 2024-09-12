// src/components/Header.tsx
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-400 text-white py-4 shadow-md">
            <div className="container mx-auto flex flex-col items-center">
                <h1 className="text-3xl font-bold">FileShare</h1>
                <p className="mt-2 text-lg">Upload, view, and delete files with ease!</p>
            </div>
        </header>
    );
};

export default Header;
