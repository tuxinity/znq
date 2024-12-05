import React, { useEffect } from 'react';
import { ToastProvider, Toast, ToastTitle, ToastClose } from '../ui/toast';
import Image from "next/image";

interface ToastProps {
  message: string;
  status: string;
  onClose: () => void;
}

export const CustomToast: React.FC<ToastProps> = ({ message, status, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <ToastProvider>
      <Toast>
        <div className={`flex items-center justify-center p-4 rounded-lg shadow-md ${status === "error" ? "bg-red-600" : "bg-green-600"}`}>
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${status === "error" ? "bg-red-500" : "bg-green-500"}`}>
              <Image width={50} height={50} src={status === "error" ? "/error.svg" : "/success.svg"} alt={status} className="max-w-8"/>
            </div>
            <div>
              <ToastTitle className="font-semibold text-white">{message}</ToastTitle>
            </div>
            <ToastClose onClick={onClose} className="cursor-pointer text-white hover:text-gray-300">
              <Image width={30} height={30} src="/close.svg" alt="close" />
            </ToastClose>
          </div>
        </div>
      </Toast>
    </ToastProvider>
  );
};
