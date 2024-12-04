/* eslint-disable @next/next/no-img-element */
interface HeaderProps {
  label: string;
}
export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <img src="/logo-text.png" alt="logo-text" className="w-40" />
      <p className="text-muted-foreground text-sm">{label}</p>
    </div>
  );
};
