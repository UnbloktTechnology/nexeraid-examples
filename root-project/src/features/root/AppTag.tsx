export type AppTagProps = {
  text: string;
};

export default function AppTag(props: AppTagProps) {
  return (
    <div className="rounded bg-[#ccc] px-1 text-xs font-bold text-white">
      {props.text}
    </div>
  );
}
