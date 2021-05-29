import { CircularProgressbar } from "react-circular-progressbar";
import { MdCheckCircle, MdError, MdLink } from "react-icons/md";

import styles from '../styles/components/FileList.module.css';

interface FileListProps {
    files: UploadedFiles[],
    onDelete: (id: string) => void
}

interface UploadedFiles {
    id: string,
    preview: string,
    name: string,
    readableSize: string,
    uploaded: boolean,
    error: boolean,
    progress: number,
    url: string
}


const FileList: React.FC<FileListProps> = ({ files, onDelete }) => {
    return (
        <ul className={styles.container}>
            {files.map(file => (
                <li key={file.id}>
                    <div className={styles.fileInfo}>
                        <div 
                            className={styles.preview} 
                            style={{backgroundImage: "url(" + file.preview + ")"}} 
                        />
                        <div>
                            <strong>
                                {file.name.length > 19 
                                ? `${file.name.slice(0,16)}(...).${file.name.slice(-3)}`
                                : file.name}
                            </strong>
                            <span>
                                {file.readableSize}{" "}
                                    <button onClick={() => onDelete(file.id)}>
                                        Excluir
                                    </button>
                            </span>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default FileList;