import { Navbar } from "./_components/navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="h-full flex-col flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900 to-gray-800">
      <Navbar />
      {children}
    </div>
  )
}

export default ProtectedLayout;