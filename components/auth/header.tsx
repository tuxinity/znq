import Image from "next/image"
interface HeaderProps {
  label: string;
}
export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <Image src="/logo-text.png" alt="logo-text" width={130} height={0} className="w-auto h-auto" style={{ width: "auto", height: "auto" }} />
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};
