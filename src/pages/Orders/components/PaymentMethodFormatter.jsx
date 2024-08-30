import { Tag } from "antd";

function CashIcon(props) {
  return (
    <svg
      viewBox="0 0 576 512"
      fill="currentColor"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M64 64C28.7 64 0 92.7 0 128v256c0 35.3 28.7 64 64 64h448c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64zm64 320H64v-64c35.3 0 64 28.7 64 64zM64 192v-64h64c0 35.3-28.7 64-64 64zm384 192c0-35.3 28.7-64 64-64v64h-64zm64-192c-35.3 0-64-28.7-64-64h64v64zM288 352c-53 0-96-43-96-96s43-96 96-96 96 43 96 96-43 96-96 96z" />
    </svg>
  );
}

function CreditCardIcon(props) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M0 4a2 2 0 012-2h12a2 2 0 012 2v5H0V4zm11.5 1a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h2a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-2zM0 11v1a2 2 0 002 2h12a2 2 0 002-2v-1H0z" />
    </svg>
  );
}

function DebitCardIcon(props) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M0 4a2 2 0 012-2h12a2 2 0 012 2v1H0V4zm0 3v5a2 2 0 002 2h12a2 2 0 002-2V7H0zm3 2h1a1 1 0 011 1v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-1a1 1 0 011-1z" />
    </svg>
  );
}

export default function PaymentMethodFormatter({ paymentMethod }) {
  switch (paymentMethod) {
    case "CASH":
      return <Tag bordered={false} color="green"><div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ marginRight: "2px", display: "flex", alignItems: "center", }}><CashIcon /></div> Cash</div></Tag>
    case "CREDIT_CARD":
      return <Tag bordered={false} color="red"><div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ marginRight: "2px", display: "flex", alignItems: "center", }}><CreditCardIcon /></div> Credit Card</div></Tag>
      case "DEBIT_CARD":
      return <Tag bordered={false} color="blue"><div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ marginRight: "2px", display: "flex", alignItems: "center", }}><DebitCardIcon /></div> Debit Card</div></Tag>
    default:
      return null;
  }
}