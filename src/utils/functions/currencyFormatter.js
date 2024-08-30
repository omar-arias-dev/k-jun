/* 
const format = 'en-US';
const style = 'currency';
const currency = 'USD'; */
const format = 'en-MX';
const style = 'currency';
const currency = 'MXN';

export const currencyFormatter = new Intl.NumberFormat(
  format,
  {
    style,
    currency,
  }
);

export const moneyFormatter = (money) => currencyFormatter.format(money);