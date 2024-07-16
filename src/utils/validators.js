import { EMAIL_REGEX, MONEY_REGEX, NUMBER_REGEX } from "./regex";

export const moneyValidator = (money) => MONEY_REGEX.test(money);
export const numberValidator = (number) => NUMBER_REGEX.test(number);
export const emailValidator = (email) => EMAIL_REGEX.test(email);