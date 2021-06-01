import { useEffect, useState } from 'react';
import { uniqueId } from 'lodash';
import filesize from 'filesize';
import { MdAddBox } from "react-icons/md";

import PageFooter from '../../components/PageFooter';
import PageHeaderAdministration from '../../components/PageHeaderAdministration';
import FileList from '../../components/FileList';

import styles from '../../styles/pages/ProductForm.module.css';

import Upload from '../../components/Upload';

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

interface Category {
    id: string;
    name: string;
}

interface Provider {
    id: string;
    name: string;
}

function productForm() {

    const [categories, setCategories] = useState<Category[]>([]);
    const [providers, setProviders] = useState<Provider[]>([]);
    
    const [categoriesSelected, setCategoriesSelected] = useState<Category[]>([]);
    const [providersSelected, setProvidersSelected] = useState<Provider[]>([]);

    const [isCategorySelectActive, setIsCategorySelectActive] = useState(false);
    const [isProviderSelectActive, setIsProviderSelectActive] = useState(false);

    const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles[]>([]);


    const handleSelectCategory = (event) => {
        setCategoriesSelected(categoriesSelected.concat(categories.filter(category => category.id === event.target.value)))
        setCategories(categories.filter(category => category.id !== event.target.value))
        setIsCategorySelectActive(false);
    }

    const handleAddCategory = (event) => {
        setIsCategorySelectActive(true);
    }

    const handleCancelSelectCategory = (event) => {
        setIsCategorySelectActive(false);
    }

    const handleDeleteCategory = (category : Category) => {
        setCategoriesSelected(categoriesSelected.filter(categoryKeep => categoryKeep !== category));
        setCategories(categories.concat(category));
    };

    const handleSelectProvider = (event) => {
        setProvidersSelected(providersSelected.concat(providers.filter(provider => provider.id === event.target.value)))
        setProviders(providers.filter(provider => provider.id !== event.target.value))
        setIsProviderSelectActive(false);
    }

    const handleAddProvider = (event) => {
        setIsProviderSelectActive(true);
    }

    const handleCancelSelectProvider = (event) => {
        setIsProviderSelectActive(false);
    }

    const handleDeleteProvider = (provider : Provider) => {
        setProvidersSelected(providersSelected.filter(providerKeep => providerKeep !== provider));
        setProviders(providers.concat(provider));
    };

    useEffect(() => {
        const categories = [{ id: '1', name: 'Eletrônicos' }, { id: '2', name: 'Ferramentas' }, { id: '3', name: 'Escritório' }, { id: '4', name: 'Eletrônicos' }, { id: '5', name: 'Ferramentas' }, { id: '6', name: 'Escritório' }, { id: '7', name: 'Eletrônicos' }, { id: '8', name: 'Ferramentas' }, { id: '9', name: 'Escritório' }];
        const providers = [{ id: '1', name: 'MJR Cunha Distribuidora de Materiais para Construção' },
        { id: '2', name: 'Construjá Distribuidora de Materiais para Construção Ltda' },
        { id: '3', name: 'Granstoque Atacadista de Materiais Para Construção' }];
        const categoriesSelected = [{ id: '1', name: 'Eletrônicos' },
        { id: '2', name: 'Ferramentas' },
        { id: '3', name: 'Escritório' }]

        setCategories(categories);
        setProviders(providers);
    }, [])

    useEffect(() => {
        if (categoriesSelected.length === 0) {
            setIsCategorySelectActive(true);
        }

    }, [categoriesSelected])

    useEffect(() => {
        if (providersSelected.length === 0) {
            setIsProviderSelectActive(true);
        }

    }, [providersSelected])



    // async function componentDidMount() {
    //     const response = await api.get("products");

    //     setUploadedFiles(response.data.map(file => ({
    //         id: file._id,
    //         name: file.name,
    //         readableSize: filesize(file.size),
    //         preview: file.url,
    //         uploaded: true,
    //         url: file.url
    //     })))
    // }

    const handleUpload = files => {
        const uploadedFilesNew = files.map(file => ({
            file,
            id: uniqueId(),
            name: file.name,
            readableSize: filesize(file.size),
            preview: URL.createObjectURL(file),
            progress: 0,
            uploaded: false,
            error: false,
            url: null,
        }))

        setUploadedFiles(uploadedFiles.concat(uploadedFilesNew));
    };

    const updateFile = (id, data) => {

        setUploadedFiles(uploadedFiles.map(uploadedFile => {
            return id === uploadedFile.id
                ? { ...uploadedFile, ...data }
                : uploadedFile;
        }));
    };


    const handleDeleteUploadedFiles = id => {
        setUploadedFiles(uploadedFiles.filter(file => file.id !== id));
    };

    function componentWillUnmount() {
        uploadedFiles.forEach(file => URL.revokeObjectURL(file.preview));
    }

    return (
        <div className={styles.container}>
            <PageHeaderAdministration />
            <div className={styles.productForm}>
                <h1>Cadastrar Produto</h1>
                <div className={styles.formContainer}>
                    <form encType="multipart/form-data">
                        <div className={styles.name}>
                            <label htmlFor="nome">Nome</label>
                            <div className={styles.inputContainer}>
                                <input type="text" placeholder="Nome" name="nome" autoComplete="off" required />
                            </div>
                        </div>
                        <div className={styles.brand}>
                            <label htmlFor="marca">Marca</label>
                            <div className={styles.inputContainer}>
                                <input type="text" placeholder="Marca" name="marca" autoComplete="off" required />
                            </div>
                        </div>
                        <div className={styles.description}>
                            <label htmlFor="descricao">Descrição</label>
                            <div className={styles.inputContainer}>
                                <textarea placeholder="Descrição" name="descricao" autoComplete="off" required />
                            </div>
                        </div>
                        <div className={styles.size}>
                            <label htmlFor="tamanho">Tamanho</label>
                            <div className={styles.inputContainer}>
                                <input type="text" placeholder="Tamanho" name="tamanho" autoComplete="off" required />
                            </div>
                        </div>
                        <div className={styles.salePrice}>
                            <label htmlFor="precoDeVenda">Preço de venda</label>
                            <div className={styles.inputContainer}>
                                <div className={styles.currency}>R$</div>
                                <input type="text" placeholder="" name="precoDeVenda" autoComplete="off" required />
                            </div>
                        </div>
                        <div className={styles.provider}>
                            <label htmlFor="fornecedor">Fornecedor</label>
                            {isProviderSelectActive
                                ? <div className={styles.selectContainer}>
                                    <select name="fornecedor" onChange={handleSelectProvider}>
                                        <option value="0">Selecione um fonecedor</option>
                                        {providers.map(provider => (
                                            <option key={provider.id} value={provider.id}>{provider.name}</option>
                                        ))}
                                    </select>
                                    {providersSelected.length > 0
                                    ? <div className={styles.cancelSelect}><button onClick={handleCancelSelectProvider}>Cancelar</button></div>
                                    : ''}
                                </div>
                                : <button className={styles.addProvider} onClick={handleAddProvider}>
                                    <span>Adicionar fornecedor</span>
                                    <MdAddBox
                                        color='#fca311'
                                        size={32}
                                    />
                                </button>}
                            <div className={styles.providersSelected}>
                            {providersSelected.map(providerSelected => (
                                    <div key={providerSelected.id} className={styles.providerItemSelected}>
                                        <div>{providerSelected.name}</div>
                                        <button onClick={() => handleDeleteProvider(providerSelected)}>
                                            <img src="/icons/close_black_36dp.svg" alt="x" title="Excluir" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.category}>
                            <label htmlFor="categoria">Categoria</label>
                            {isCategorySelectActive
                                ? <div className={styles.selectContainer}>
                                    <select name="categoria" onChange={handleSelectCategory}>
                                        <option value="0">Selecione uma categoria</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                    {categoriesSelected.length > 0
                                    ? <div className={styles.cancelSelect}><button onClick={handleCancelSelectCategory}>Cancelar</button></div>
                                    : ''}
                                </div>
                                : <button className={styles.addCategory} onClick={handleAddCategory}>
                                    <span>Adicionar categoria</span>
                                    <MdAddBox
                                        color='#fca311'
                                        size={32}
                                    />
                                </button>}

                            <div className={styles.categoriesSelected}>
                                {categoriesSelected.map(categorySelected => (
                                    <div key={categorySelected.id} className={styles.categoryItemSelected}>
                                        <div>{categorySelected.name}</div>
                                        <button onClick={() => handleDeleteCategory(categorySelected)}>
                                            <img src="/icons/close_black_36dp.svg" alt="x" title="Excluir" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.barcode}>
                            <label htmlFor="codigo de barra">Código de barra</label>
                            <div className={styles.inputContainer}>
                                <input
                                    type="text"
                                    placeholder="Código de barra"
                                    minLength={12}
                                    maxLength={13}
                                    autoComplete="off"
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles.image}>
                            <label htmlFor="imagem">Imagem</label>
                            <div className={styles.inputContainer}>
                                <Upload onUpload={handleUpload} />
                                {!!uploadedFiles.length && (
                                    <FileList files={uploadedFiles} onDelete={handleDeleteUploadedFiles} />
                                )}
                            </div>
                        </div>
                        <div className={styles.buttonsContainer}>
                            <div className={styles.create}>
                                <input type="submit" value="Cadastrar" />
                            </div>
                            <div className={styles.reset}>
                                <input type="reset" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <PageFooter />
        </div>
    );
}

export default productForm;