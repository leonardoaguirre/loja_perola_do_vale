export const Utils = {
  formatMoney: (value) => {
    return parseFloat(value.toString()).toFixed(2).replace('.', ',');
  }
}