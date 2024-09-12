import React from 'react';
import FileItem from './FileItem';

interface FileGridProps {
    files: {
        _id: string;
        fileUrl: string;
        filename: string;
        type: string;
    }[];
    onDelete: (fileUrl: string) => void;
}

const FileGrid: React.FC<FileGridProps> = ({ files, onDelete }) => {
    return (
        <div className="file-grid" style={styles.fileGrid}>
            {files.map((file) => (
                <FileItem key={file._id} file={file} onDelete={onDelete} />
            ))}
        </div>
    );
};

const styles = {
    fileGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '10px',
        padding: '20px',
    },
};

export default FileGrid;
