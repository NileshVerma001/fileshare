// src/app/page.tsx
import React from 'react';
import FileShare from '../components/FileShare';
import Header from "../components/Header";

export default function HomePage() {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
    
            <FileShare />
        </div>
    );
}
