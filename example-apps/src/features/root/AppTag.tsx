export type AppTagProps = {
  text: string;
  color: string;
};

export default function AppTag(props: AppTagProps) {
  return (
    <div
      className={`flex h-7 w-7 items-center justify-center rounded-full px-1 text-xs font-bold text-white`}
      style={{ backgroundColor: props.color }}
    >
      {props.text}
    </div>
  );
}
