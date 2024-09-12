"use client";
import React, { useState, useEffect } from 'react';
import FileGrid from './FileGrid'; // Import the FileGrid component

interface FileType {
    _id: string;
    fileUrl: string;
    filename: string;
    type: string; // Add the 'type' field
    createdAt: string;
}


const FileShare = () => {
    const [files, setFiles] = useState<FileType[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        async function fetchFiles() {
            const response = await fetch('/api/files');
            const data = await response.json();
    
            // Map through the files and ensure each file has a 'type' property
            const filesWithTypes = data.map((file: any) => ({
                ...file,
                type: file.type || inferFileType(file.filename), // Infer type if not provided
            }));
    
            const sortedFiles = filesWithTypes.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setFiles(sortedFiles);
        }
    
        fetchFiles();
    }, []);

    function inferFileType(filename: string): string {
        const extension = filename.split('.').pop();
        switch (extension) {
            case 'pdf':
                return 'application/pdf';
            case 'docx':
                return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            case 'jpg':
            case 'jpeg':
            case 'png':
                return 'image/jpeg';
            default:
                return 'application/octet-stream'; // Default MIME type
        }
    }
    
    

    const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!selectedFile) return;
    
        const formData = new FormData();
        formData.append('file', selectedFile);
    
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });
    
        if (response.ok) {
            const data = await response.json();
    
            // Add the file type when uploading
            const newFile = {
                ...data,
                type: selectedFile.type || inferFileType(selectedFile.name),
            };
    
            setFiles([newFile, ...files]);
        }
    };
    

    const handleDelete = async (fileUrl: string) => {
        const response = await fetch('/api/files', {
            method: 'DELETE',
            body: JSON.stringify({ fileUrl }),
        });

        if (response.ok) {
            setFiles(files.filter(file => file.fileUrl !== fileUrl));
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
                <input 
                    type="file" 
                    onChange={(e) => {
                        const file = e.target.files ? e.target.files[0] : null;
                        setSelectedFile(file);
                    }} 
                />
                <button onClick={handleUpload}>Upload</button>
            </div>
            <div style={{ flex: 3 }}>
                <FileGrid files={files} onDelete={handleDelete} />
            </div>
        </div>
    );
};

export default FileShare;
