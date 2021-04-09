import PageFooter from '../../components/PageFooter';
import PageHeaderAdministration from '../../components/PageHeaderAdministration';
import styles from '../../styles/pages/ProductForm.module.css';

function productForm() {
    return (
        <div className={styles.container}>
            <PageHeaderAdministration />
            <div className={styles.productForm}>
                <h1>Cadastrar Produto</h1>
                <div className={styles.formContainer}>
                    <form>
                        <div className={styles.name}>
                            <label htmlFor="name">Nome: </label>
                            <div className={styles.inputContainer}>
                                <input type="text" placeholder="Nome" name="name" />
                            </div>
                        </div>
                        <div className={styles.brand}>
                            <label htmlFor="marca">Marca: </label>
                            <div className={styles.inputContainer}>
                                <input type="text" placeholder="Marca" name="marca" />
                            </div>
                        </div>
                        <div className={styles.description}>
                            <label htmlFor="descricao">Descrição: </label>
                            <div className={styles.inputContainer}>
                                <input type="text" placeholder="Descrição" name="descricao" />
                            </div>
                        </div>
                        <div className={styles.size}>
                            <label htmlFor="tamanho">Tamanho: </label>
                            <div className={styles.inputContainer}>
                                <input type="text" placeholder="Tamanho" name="" />
                            </div>
                        </div>
                        <div className={styles.salePrice}>
                            <label htmlFor="preco de venda">Preço de venda: </label>
                            <div className={styles.inputContainer}>
                                <input type="text" placeholder="Preço de venda" />
                            </div>
                        </div>
                        <div className={styles.provider}>
                            <label htmlFor="fornecedor">Fornecedor: </label>
                            <div className={styles.selectContainer}>
                                <select name="provider">
                                    <option value="valor0">Selecione o fornecedor</option>
                                    <option value="valor1">MJR Cunha Distribuidora de Materiais para Construção</option>
                                    <option value="valor2">Construjá Distribuidora de Materiais para Construção Ltda</option>
                                    <option value="valor3">Granstoque Atacadista de Materiais Para Construção</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.category}>
                            <label>Categoria: </label>
                            <fieldset>
                                <div className={styles.checkboxOption}>
                                    <input type="checkbox" id="eletronicsCheckbox" />
                                    <label htmlFor="eletronicsCheckbox">Eletrônicos</label>
                                </div>
                                <div className={styles.checkboxOption}>
                                    <input type="checkbox" id="toolsCheckbox" />
                                    <label htmlFor="toolsCheckbox">Ferramentas</label>
                                </div>
                                <div className={styles.checkboxOption}>
                                    <input type="checkbox" id="materialsCheckbox" />
                                    <label htmlFor="materialsCheckbox">Materiais</label>
                                </div>
                                <div className={styles.checkboxOption}>
                                    <input type="checkbox" id="furnitureCheckbox" />
                                    <label htmlFor="furnitureCheckbox">Móveis</label>
                                </div>
                                <div className={styles.checkboxOption}>
                                    <input type="checkbox" id="maintenanceCheckbox" />
                                    <label htmlFor="maintenanceCheckbox">Manutenção</label>
                                </div>
                                <div className={styles.checkboxOption}>
                                    <input type="checkbox" id="motorsCheckbox" />
                                    <label htmlFor="motorsCheckbox">Motores</label>
                                </div>
                            </fieldset>
                        </div>
                        <div className={styles.barcode}>
                            <label htmlFor="codigo de barra">Código de barra: </label>
                            <div className={styles.inputContainer}>
                                <input 
                                    type="text" 
                                    placeholder="Código de barra" 
                                    minLength={12} 
                                    maxLength={13} 
                                />
                            </div>
                        </div>
                        <div className={styles.image}>
                            <label htmlFor="imagem">Imagem: </label>
                            <div className={styles.inputContainer}>
                                <input type="file" id="imageFile" name="imageFile" />
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