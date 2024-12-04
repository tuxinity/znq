const AuthLogin = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-900 to-gray-800">
      {children}
    </div>
  );
};

export default AuthLogin;
