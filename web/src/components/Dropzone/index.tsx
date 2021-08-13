import Dropzone, { DropEvent } from "react-dropzone";

import styles from './styles.module.css';

interface UploadProps {
  onUpload: (files: File[], event: DropEvent) => void;
  filesLength: number;
  filesLimit: number;
  isDisabled: boolean;
}

const Upload: React.FC<UploadProps> = (props) => {

  const renderDragMessage = (isDragActive, isDragReject, draggedFiles) => {

    if (!isDragActive) {
      return <div className={styles.uploadMessage}>Arraste arquivos aqui...</div>;
    }

    if ((draggedFiles.length + props.filesLength) > 5) {
      return <div className={`${styles.uploadMessage} ${styles.dragReject}`} data-type="error">Limite de arquivos excedido</div>;
    }

    if (isDragReject) {
      return <div className={`${styles.uploadMessage} ${styles.dragReject}`} data-type="error">Arquivo não suportado</div>;
    }

    return <div className={`${styles.uploadMessage} ${styles.dragActive}`} data-type="success">Solte os arquivos aqui</div>;
  };

  return (
    <Dropzone accept="image/png, image/jpeg, image/jpg" onDropAccepted={props.onUpload} maxFiles={props.filesLimit} disabled={props.isDisabled}>
      {({ getRootProps, getInputProps, isDragActive, isDragReject, draggedFiles }) => (
        <div
          {...getRootProps()}
          className={styles.dropzone}
        >
          <input {...getInputProps()} />
          {renderDragMessage(isDragActive, isDragReject, draggedFiles)}
        </div>
      )}
    </Dropzone>
  );
}

export default Upload;