import Dropzone, { DropEvent } from "react-dropzone";

import styles from '../styles/components/Upload.module.css';

interface UploadProps {
    onUpload: (files: File[], event: DropEvent) => void
}

const Upload: React.FC<UploadProps> = (props) => {
    
    const renderDragMessage = (isDragActive, isDragReject) => {
        if (!isDragActive) {
            return <div className={styles.uploadMessage}>Arraste arquivos aqui...</div>;
        }

        if (isDragReject) {
            return <div className={`${styles.uploadMessage} ${styles.dragReject}`} data-type="error">Arquivo não suportado</div>;
        }

        return <div className={`${styles.uploadMessage} ${styles.dragActive}`} data-type="success">Solte os arquivos aqui</div>;
    };

    return (
        <Dropzone accept="image/png, image/jpeg, image/jpg" onDropAccepted={props.onUpload}>
        {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
          <div
            {...getRootProps()}
            className={styles.dropzone}
          >
            <input {...getInputProps()} />
            {renderDragMessage(isDragActive, isDragReject)}
          </div>
        )}
      </Dropzone>
    );
}

export default Upload;