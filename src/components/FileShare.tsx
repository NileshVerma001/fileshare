"use client";
import React, { useState, useEffect, useRef } from 'react';
import FileGrid from './FileGrid'; 
import axios from 'axios';

interface FileType {
    _id: string;
    fileUrl: string;
    filename: string;
    type: string; 
    createdAt: string;
}

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_UPLOADS = 5;
const UPLOAD_INTERVAL = 60000; 

const FileShare = () => {
    const [files, setFiles] = useState<FileType[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadTimes, setUploadTimes] = useState<number[]>([]);

    useEffect(() => {
        async function fetchFiles() {
            const response = await fetch('/api/files');
            const data = await response.json();
    
            const filesWithTypes = data.map((file: any) => ({
                ...file,
                type: file.type || inferFileType(file.filename),
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
            case 'mp4':
            case 'avi':
                return 'video/mp4';
            default:
                return 'application/octet-stream';
        }
    }

    const canUploadFile = () => {
        const now = Date.now();
        const recentUploads = uploadTimes.filter(time => now - time < UPLOAD_INTERVAL);
        return recentUploads.length < MAX_FILE_UPLOADS;
    };

    const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!selectedFile) return;

        // Check for file size
        if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            alert(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
            return;
        }

        if (!canUploadFile()) {
            alert('You can only upload 5 files within 60 seconds.');
            return;
        }

        // Check if the file is an image or video and detect a person if needed
        if (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/')) {
            const personDetected = await detectPersonInImage(selectedFile);
            if (personDetected) {
                alert('Image/Video contains people, cannot upload.');
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
            const newFile = {
                ...data,
                type: selectedFile.type || inferFileType(selectedFile.name),
            };

            setFiles([newFile, ...files]);

            // Record the time of this upload
            setUploadTimes([...uploadTimes, Date.now()]);
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

        const detections = response.data.predictions;
        const personDetected = detections.some((detection: any) => detection.confidence > 0.6);
        return personDetected;
    } catch (error) {
        console.error("Error detecting person in image:", error);
        alert("Error detecting person in image. Please try again.");
        return false;
    }
};

export default FileShare;
