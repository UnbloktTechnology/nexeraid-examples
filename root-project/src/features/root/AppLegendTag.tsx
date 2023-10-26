import AppTag from "./AppTag";

export type AppLegendTagProps = {
  text: string;
  color: string;
  tag: string;
};

export default function AppLegendTag(props: AppLegendTagProps) {
  return (
    <div className="box-border flex items-center justify-center gap-2 rounded-full border border-solid border-[#ccc] p-px pr-1 text-xs">
      <AppTag text={props.tag} color={props.color} />
      {props.text}
    </div>
  );
}
