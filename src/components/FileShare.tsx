"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios

// Define a type for the files
interface FileType {
    _id: string;
    fileUrl: string;
    filename: string;
    createdAt: string; // Assuming there is a createdAt field for sorting
}

const FileShare = () => {
    const [files, setFiles] = useState<FileType[]>([]); // Array of FileType objects
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // File or null

    useEffect(() => {
        // Fetch files on page load
        async function fetchFiles() {
            const response = await fetch('/api/files');
            const data: FileType[] = await response.json();

            // Sort files by creation date (newest first)
            const sortedFiles = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setFiles(sortedFiles);
        }
        fetchFiles();
    }, []);

    // Function to detect a person in the image using Roboflow API
    const detectPersonInImage = async (file: File) => {
        const loadImageBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
        };

        const base64Image = await loadImageBase64(file);

        try {
            const response = await axios({
                method: "POST",
                url: "https://detect.roboflow.com/data1-ddp9v-6dnyh/1",
                params: {
                    api_key: process.env.NEXT_PUBLIC_FACE_API
                },
                data: base64Image,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            // Check if any prediction has a confidence greater than 0.6
            const detections = response.data.predictions;
            const personDetected = detections.some((detection: any) => detection.confidence > 0.6);
            return personDetected;
        } catch (error) {
            console.error("Error detecting person in image:", error);
            alert("Error detecting person in image. Please try again.");
            return false;
        }
    };

    const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!selectedFile) return; // Ensure a file is selected before proceeding

        // Check file size (5 MB = 5 * 1024 * 1024 bytes)
        const maxSizeInBytes = 5 * 1024 * 1024; 
        if (selectedFile.size > maxSizeInBytes) {
            alert('File size should not exceed 5 MB.');
            return;
        }

        // Determine the MIME type of the file
        const fileType = selectedFile.type;

        // Only check for images and videos
        if (fileType.startsWith("image/") || fileType.startsWith("video/")) {
            // Check for a person in the image or video
            const personDetected = await detectPersonInImage(selectedFile);
            if (personDetected) {
                alert("Person detected in the image or video. Cannot upload.");
                return;
            }
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            // Add the new file at the beginning of the list
            setFiles([data, ...files]); // Update the UI with the new file at the top
        }
    };

    const handleDelete = async (fileUrl: string) => {
        const response = await fetch('/api/files', {
            method: 'DELETE',
            body: JSON.stringify({ fileUrl }),
        });

        if (response.ok) {
            setFiles(files.filter(file => file.fileUrl !== fileUrl)); // Update the UI
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            {/* Left panel */}
            <div style={{ flex: 1 }}>
                <input 
                    type="file" 
                    onChange={(e) => {
                        const file = e.target.files ? e.target.files[0] : null;
                        setSelectedFile(file); // Handle null cases
                    }} 
                />
                <button onClick={handleUpload}>Upload</button>
            </div>

            {/* Right panel */}
            <div style={{ flex: 3 }}>
                <ul>
                    {files.map(file => (
                        <li key={file._id}>
                            <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">{file.filename}</a>
                            <button onClick={() => handleDelete(file.fileUrl)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FileShare;
