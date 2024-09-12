// src/app/page.tsx
import React from 'react';
import FileShare from '../components/FileShare';

export default function HomePage() {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ textAlign: 'center' }}>File Sharing App</h1>
            <p style={{ textAlign: 'center' }}>Upload, view, and delete files with ease!</p>
            <FileShare />
        </div>
    );
}
