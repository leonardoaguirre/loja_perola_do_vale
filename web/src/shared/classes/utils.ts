export const Utils = {
  formatMoney: (value) => {
    return parseFloat(value.toString()).toFixed(2).replace('.', ',');
  },
  //Data do tipo dd-mm-yyyy para yyyy-mm-dd
  formatDate: (value: Date) => {
    return new Date(value).toISOString().split('T')[0]
  },
  //Corrige falha de datas com uso de '-' para o uso de '/'
  showCorrectDate :(value: Date)=>{
    return new Date(String(value).replace('-','/')).toLocaleDateString()
  }
}