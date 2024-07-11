//import { shortAddress, type Address } from "@nexeraprotocol/identity-schemas";

export const DisplayTokenBalance = (props: {
  title: string;
  balance: number;
}) => {
  return (
    <div className="mt-2">
      <h2 className={"text-2xl font-bold"}>{props.title}</h2>
      <div className="m-2 h-64 overflow-y-auto border border-black p-4">
        {props.balance}
      </div>
    </div>
  );
};
