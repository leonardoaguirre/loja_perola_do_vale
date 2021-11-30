import filesize from 'filesize';
import { uniqueId } from 'lodash';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { MdAddBox } from 'react-icons/md';

import Dropzone from '../../../../../components/Dropzone';
import FileList from '../../../../../components/FileList';
import Footer from '../../../../../components/Footer';
import Header from '../../../../../components/Header';
import { environment } from '../../../../../environments/environment';
import apiWithAuth from '../../../../../services/apiWithAuth';
import styles from './styles.module.css';
import { Container, Row, Col, Button } from 'react-bootstrap';


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
    const response = await fetch(`${environment.API}/fornecedor/ListarNomes`);
    const data: Provider[] = await response.json();

    setProviders(data);
  }

  const fillCategories = async () => {
    const response = await fetch(`${environment.API}/categoria/listar`);
    const data: { categories: Category[], nPages: number } = await response.json();

    setCategories(data.categories);
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

    await fetch(`${environment.API}/produto/adicionar`, {
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
    <div className="pageContainer">
      <Head><title>Cadastrar Produto | Ferragens Pérola do Vale</title></Head>
      <Header />
      <div className="pageContent">
        <h1>Cadastrar Produto</h1>
        <div className={styles.formContainer}>
          <form encType="multipart/form-data" onSubmit={handleSubmit}>
            <Container fluid>
              <Row className="pb-4">
                <Col xs={12} md={3}>
                  <div className={styles.name}>
                    <label htmlFor="nome"><strong>Nome</strong></label>
                    <div className={styles.inputContainer}>
                      <input type="text" placeholder="Nome" name="nome" autoComplete="off" onChange={handleInputChange} required />
                    </div>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div className={styles.barcode}>
                    <label htmlFor="codBarra"><strong>Código de barra</strong></label>
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
                </Col>
                <Col xs={6} md={3}>
                  <div className={styles.brand}>
                    <label htmlFor="marca"><strong>Marca</strong></label>
                    <div className={styles.inputContainer}>
                      <input type="text" placeholder="Marca" name="marca" autoComplete="off" onChange={handleInputChange} required />
                    </div>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div className={styles.qtd}>
                    <label htmlFor="quantidade"><strong>Quantidade</strong></label>
                    <div className={styles.inputContainer}>
                      <input type="text" placeholder="Quantidade" name="quantidade" autoComplete="off" onChange={handleInputChange} required />
                    </div>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div className={styles.altura}>
                    <label htmlFor="altura"><strong>Altura</strong></label>
                    <div className={styles.inputContainer}>
                      <input type="text" placeholder="Altura" name="altura" autoComplete="off" onChange={handleInputChange} required />
                    </div>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div className={styles.size}>
                    <label htmlFor="largura"><strong>Largura</strong></label>
                    <div className={styles.inputContainer}>
                      <input type="text" placeholder="Largura" name="largura" autoComplete="off" onChange={handleInputChange} required />
                    </div>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div className={styles.comprimento}>
                    <label htmlFor="comprimento"><strong>Comprimento</strong></label>
                    <div className={styles.inputContainer}>
                      <input type="text" placeholder="Comprimento" name="comprimento" autoComplete="off" onChange={handleInputChange} required />
                    </div>
                  </div>
                </Col>
                <Col xs={6} md={3}>
                  <div className={styles.peso}>
                    <label htmlFor="Peso"><strong>Peso</strong></label>
                    <div className={styles.inputContainer}>
                      <input type="text" placeholder="Peso" name="peso" autoComplete="off" onChange={handleInputChange} required />
                    </div>
                  </div>
                </Col>
                <Col xs={6} md={4}>
                  <div className={styles.salePrice}>
                    <label htmlFor="valorVenda"><strong>Preço de venda</strong></label>
                    <div className={styles.inputContainer}>
                      <div className={styles.currency}>R$</div>
                      <input type="number" placeholder="" name="valorVenda" autoComplete="off" onChange={handleInputChange} required />
                    </div>
                  </div>
                </Col>
                <Col xs={6} md={4}>
                  <div className={styles.provider}>
                    <label htmlFor="fornecedor"><strong>Fornecedor</strong></label>
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
                </Col>
                <Col xs={6} md={4}>
                  <div className={styles.category}>
                    <label htmlFor="categoria"><strong>Categoria</strong></label>
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
                </Col>
                <Col xs={6}>
                  <div className={styles.description}>
                    <label htmlFor="descricao"><strong>Descrição</strong></label>
                    <div className={styles.inputContainer}>
                      <textarea placeholder="Descrição" name="descricao" autoComplete="off" onChange={handleInputChange} required />
                    </div>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className={styles.image}>
                    <label htmlFor="imagem"><strong>Imagem</strong></label>
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
                </Col>
              </Row>
              <Row className="d-flex justify-content-center">
                <Col xs={12} sm={6}>
                  <div className={styles.buttonsContainer}>
                    <div className={styles.create}>
                      <Button className="w-100" type="submit"><strong>Cadastrar</strong></Button>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </form>
        </div>
      </div>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { tokenCookie } = context.req.cookies;

  if (!tokenCookie) {
    return {
      redirect: {
        destination: '/user/login',
        permanent: false,
      }
    }
  }
  return await apiWithAuth(tokenCookie).get('Funcionario/Autorizar')
    .then(res => {
      return { props: {} }
    })
    .catch(err => {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        }
      }
    })
}
export default productForm;