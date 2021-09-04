import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { uniqueId } from 'lodash';
import filesize from 'filesize';
import { MdAddBox } from "react-icons/md";

import Header from '../../../../../components/Header';
import Footer from '../../../../../components/Footer';
import FileList from '../../../../../components/FileList';
import Dropzone from '../../../../../components/Dropzone';

import styles from './styles.module.css';


interface UploadedFiles {
  file: File,
  id: string,
  preview: string,
  name: string,
  readableSize: string,
  uploaded: boolean,
  error: boolean,
  url: string
}

interface Category {
  id: string;
  descricao: string;
}

interface Provider {
  id: string;
  pessoaJuridica: {
    nomeFantasia: string;
  }
}

function productForm() {

  const [formData, setFormData] = useState({
    nome: '',
    marca: '',
    descricao: '',
    valorVenda: '',
    codBarra: '',
    quantidade: '',
    peso: '',
    altura: '',
    largura: '',
    comprimento: ''
    // fornecedor: ''
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);

  const [categoriesSelected, setCategoriesSelected] = useState<Category[]>([]);
  const [providersSelected, setProvidersSelected] = useState<Provider[]>([]);

  const [isCategorySelectActive, setIsCategorySelectActive] = useState(false);
  const [isProviderSelectActive, setIsProviderSelectActive] = useState(false);

  const [isUploadDisabled, setIsUploadDisabled] = useState<boolean>(true);
  const [limit, setLimit] = useState<number>(5);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFiles[]>([]);

  const [images, setImages] = useState<File[]>([]);


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

  const handleDeleteCategory = (category: Category) => {
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

  const handleDeleteProvider = (provider: Provider) => {
    setProvidersSelected(providersSelected.filter(providerKeep => providerKeep !== provider));
    setProviders(providers.concat(provider));
  };

  useEffect(() => {
    fillProviders();
    fillCategories();
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

  useEffect(() => {
    if (uploadedFiles.length < 5) {
      setIsUploadDisabled(false);
      setLimit(5 - uploadedFiles.length);
    } else {
      setIsUploadDisabled(true);
    }
  }, [uploadedFiles]);

  const handleUpload = (files: File[]) => {
    if (uploadedFiles.length < 5) {
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
    }
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

  const fillProviders = async () => {
    const response = await fetch("http://localhost:3008/fornecedor/ListarNomes");
    const data: Provider[] = await response.json();

    setProviders(data);
  }

  const fillCategories = async () => {
    const response = await fetch("http://localhost:3008/categoria/listar");
    const data: Category[] = await response.json();

    setCategories(data);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value })
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { nome,
      marca,
      descricao,
      valorVenda,
      codBarra,
      quantidade,
      peso,
      altura,
      largura,
      comprimento
    } = formData;

    const categories = categoriesSelected;
    // const providers = providersSelected;

    const data = new FormData();

    data.append('nome', nome);
    data.append('codBarra', codBarra);
    data.append('marca', marca);
    data.append('descricao', descricao);
    data.append('quantidade', quantidade);
    data.append('altura', altura);
    data.append('largura', largura);
    data.append('comprimento', comprimento);
    data.append('valorVenda', valorVenda);
    data.append('peso', peso);
    categories.forEach((category) => { data.append('categorias', category.id) });

    if (uploadedFiles) {
      uploadedFiles.forEach((img) => { data.append('images', img.file) });
    } else {
      return 0;
    }

    await fetch('http://localhost:3008/produto/adicionar', {
      body: data,
      method: 'POST'
    }).then((res) => {
      if (res.ok) {
        console.log(res)
      } else {
        console.log(res)
      }
    });
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.productForm}>
        <h1>Cadastrar Produto</h1>
        <div className={styles.formContainer}>
          <form encType="multipart/form-data" onSubmit={handleSubmit}>
            <div className={styles.name}>
              <label htmlFor="nome">Nome</label>
              <div className={styles.inputContainer}>
                <input type="text" placeholder="Nome" name="nome" autoComplete="off" onChange={handleInputChange} required />
              </div>
            </div>
            <div className={styles.brand}>
              <label htmlFor="marca">Marca</label>
              <div className={styles.inputContainer}>
                <input type="text" placeholder="Marca" name="marca" autoComplete="off" onChange={handleInputChange} required />
              </div>
            </div>
            <div className={styles.description}>
              <label htmlFor="descricao">Descrição</label>
              <div className={styles.inputContainer}>
                <textarea placeholder="Descrição" name="descricao" autoComplete="off" onChange={handleInputChange} required />
              </div>
            </div>
            <div className={styles.qtd}>
              <label htmlFor="quantidade">Quantidade</label>
              <div className={styles.inputContainer}>
                <input type="text" placeholder="quantidade" name="quantidade" autoComplete="off" onChange={handleInputChange} required />
              </div>
            </div>
            <div className={styles.peso}>
              <label htmlFor="Peso">Peso</label>
              <div className={styles.inputContainer}>
                <input type="text" placeholder="Peso" name="peso" autoComplete="off" onChange={handleInputChange} required />
              </div>
            </div>
            <div className={styles.altura}>
              <label htmlFor="altura">Altura</label>
              <div className={styles.inputContainer}>
                <input type="text" placeholder="Altura" name="altura" autoComplete="off" onChange={handleInputChange} required />
              </div>
            </div>
            <div className={styles.size}>
              <label htmlFor="largura">Largura</label>
              <div className={styles.inputContainer}>
                <input type="text" placeholder="Largura" name="largura" autoComplete="off" onChange={handleInputChange} required />
              </div>
            </div>
            <div className={styles.comprimento}>
              <label htmlFor="comprimento">comprimento</label>
              <div className={styles.inputContainer}>
                <input type="text" placeholder="comprimento" name="comprimento" autoComplete="off" onChange={handleInputChange} required />
              </div>
            </div>
            <div className={styles.salePrice}>
              <label htmlFor="valorVenda">Preço de venda</label>
              <div className={styles.inputContainer}>
                <div className={styles.currency}>R$</div>
                <input type="text" placeholder="" name="valorVenda" autoComplete="off" onChange={handleInputChange} required />
              </div>
            </div>
            <div className={styles.provider}>
              <label htmlFor="fornecedor">Fornecedor</label>
              {isProviderSelectActive
                ? <div className={styles.selectContainer}>
                  <select name="fornecedor" onChange={handleSelectProvider}>
                    <option value="0">Selecione um fonecedor</option>
                    {providers.map(provider => (
                      <option key={provider.id} value={provider.id}>{provider.pessoaJuridica.nomeFantasia}</option>
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
                    <div>{providerSelected.pessoaJuridica.nomeFantasia}</div>
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
                      <option key={category.id} value={category.id}>{category.descricao}</option>
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
                    <div>{categorySelected.descricao}</div>
                    <button onClick={() => handleDeleteCategory(categorySelected)}>
                      <img src="/icons/close_black_36dp.svg" alt="x" title="Excluir" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.barcode}>
              <label htmlFor="codBarra">Código de barra</label>
              <div className={styles.inputContainer}>
                <input
                  name="codBarra"
                  type="text"
                  placeholder="Código de barra"
                  minLength={12}
                  maxLength={13}
                  autoComplete="off"
                  required
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className={styles.image}>
              <label htmlFor="imagem">Imagem</label>
              <div className={styles.inputContainer}>
                <Dropzone
                  onUpload={handleUpload}
                  filesLength={uploadedFiles.length}
                  filesLimit={limit}
                  isDisabled={isUploadDisabled}
                />
                {!!uploadedFiles.length && (
                  <FileList files={uploadedFiles} onDelete={handleDeleteUploadedFiles} />
                )}
              </div>
            </div>
            <div className={styles.buttonsContainer}>
              <div className={styles.create}>
                <input type="submit" value="Cadastrar" />
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default productForm;