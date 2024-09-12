import React, { useState, useEffect, useRef } from 'react';

interface FileItemProps {
    file: {
        _id: string;
        fileUrl: string;
        filename: string;
        type: string;
    };
    onDelete: (fileUrl: string) => void;
}

const FileItem: React.FC<FileItemProps> = ({ file, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = file.fileUrl;
        link.download = file.filename;
        link.click();
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setShowMenu(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getFileThumbnail = () => {
        if (file.type.startsWith('image/')) {
            return file.fileUrl;
        } else if (file.type === 'application/pdf') {
            return 'https://png.pngtree.com/png-vector/20221118/ourmid/pngtree-flat-business-icon-for-pdf-downloads-on-white-vector-png-image_41011092.jpg'; 
        } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs3nWc9jmdM7_WmDcEAy3PC2zMur7A1ee_bw&s'; 
        } else {
            return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3yfGRJdVxc2Ob2Uh8IcA81qVOEtOrlfxZOWJtr8F5fajY8qasBKQOOh6C5yI0Py2xvtk&usqp=CAU'; 
        }
    };

    return (
        <div className="flex flex-col justify-between p-4 border border-gray-200 rounded-md relative w-52 m-2 bg-white">
            <div className="h-40 overflow-hidden rounded-md flex justify-center items-center bg-gray-100">
                <img src={getFileThumbnail()} alt={file.filename} className="w-full object-contain bg-white" />
            </div>
            <div className="mt-2 flex justify-between items-center">
                <span className="truncate max-w-xs">{file.filename}</span>
                <div className="cursor-pointer text-gray-600 text-lg" onClick={toggleMenu}>
                    &#x22EE;
                </div>
                {showMenu && (
                    <div ref={menuRef} className="absolute bottom-2 right-2 bg-white border border-gray-200 rounded-md shadow-md z-10 w-32">
                        <button onClick={handleDownload} className="block w-full px-3 py-2 border-b border-gray-200 text-left hover:bg-gray-100">Download</button>
                        <button onClick={() => onDelete(file.fileUrl)} className="block w-full px-3 py-2 text-left hover:bg-gray-100">Delete</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileItem;
