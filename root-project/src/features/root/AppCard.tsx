import Image from "next/image";
import Link from "next/link";
import AppTag from "./AppTag";

export type AppCardProps = {
  url: string;
  name: string;
  image: string;
  tags?: string[];
};

export default function AppCard(props: AppCardProps) {
  return (
    <Link
      key={props.url}
      href={props.url}
      target="_blank"
      rel={"noopener noreferrer"}
    >
      <div className="h-full lg:mb-12">
        <div className="block h-full rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-[#e2e2e2]">
          <div className="flex h-full flex-col items-center justify-center gap-6 text-center dark:border-opacity-10">
            <Image
              src={props.image}
              alt={props.name}
              width={150}
              height={250}
            />
          </div>
        </div>
        <div className="mb-4 mt-1 flex w-full flex-wrap items-center gap-2">
          <p className="text-md w-56 flex-initial font-bold">{props.name}</p>
          {props.tags?.map((tag) => <AppTag text={tag} key={tag} />)}
          {/* <div>
          </div>
          <Image
            src={"/icons/search.svg"}
            alt={props.name}
            width={25}
            height={25}
          /> */}
        </div>
      </div>
    </Link>
  );
}
