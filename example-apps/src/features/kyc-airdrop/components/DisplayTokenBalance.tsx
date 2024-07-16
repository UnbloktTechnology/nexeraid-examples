//import { shortAddress, type Address } from "@nexeraid/identity-schemas";

export const DisplayTokenBalance = (props: { balance: number }) => {
  return (
    <div className="mt-2">
      <h2
        className={"text-2xl font-bold"}
      >{`User Balance : ${props.balance}`}</h2>
    </div>
  );
};
