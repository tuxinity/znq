import { useForm, SubmitHandler } from "react-hook-form";
import { ExtendedUser } from "@/next-auth";
import { Card, CardContent } from "./ui";
import { Badge } from "./ui/badge";
import { Settings } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogFooter } from "./ui/dialog";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { updateAddressWallet } from "@/actions/adressWallet";
import { useState } from "react";

interface UserInfoProps {
  user?: ExtendedUser;
}

interface FormInputs {
  name: string;
  email: string;
  addressWallet: string;
  role: string;
}

export const UserInfoDialog = ({ user }: UserInfoProps) => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      addressWallet: user?.addressWallet || "",
      role: user?.role || "",
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const result = await updateAddressWallet({
        userId: user?.id || "",
        addressWallet: data.addressWallet,
      });

      if (result.error) {
        setStatusMessage(`Error: ${result.error}`);
      } else {
        setStatusMessage(result.success || "Wallet address updated successfully!");
      }
    } catch (error) {
      console.error("Error updating wallet address:", error);
      setStatusMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="ml-2 flex flex-row gap-4 text-white"
        >
          <Settings className="mt-1 h-4 w-4" />
          Settings
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="max-w-[600px]">
        <DialogTitle>Data User</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="shadow-md mb-5">
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Name</label>
                <input
                  className="w-full p-2 border rounded-md"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Email</label>
                <input
                  className="w-full p-2 border rounded-md"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Wallet Address</label>
                <input
                  className="w-full p-2 border rounded-md"
                  {...register("addressWallet", { required: "Wallet Address is required" })}
                />
                {errors.addressWallet && (
                  <p className="text-xs text-red-500">{errors.addressWallet.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Role</label>
                <input
                  className="w-full p-2 border rounded-md"
                  {...register("role", { required: "Role is required" })}
                />
                {errors.role && <p className="text-xs text-red-500">{errors.role.message}</p>}
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <p className="text-sm font-medium">Two Factor Authentication</p>
                <Badge variant={user?.isTwoFactorEnabled ? "success" : "destructive"}>
                  {user?.isTwoFactorEnabled ? "ON" : "OFF"}
                </Badge>
              </div>
            </CardContent>
          </Card>
          {statusMessage && (
            <div className="mt-2 p-2 text-sm text-center text-green-800 bg-green-100 rounded-md">
                {statusMessage}
            </div>
            )}
          <DialogFooter>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md shadow hover:bg-blue-700"
            >
              Submit
            </button>
            <DialogClose asChild>
            <button
              type="button"
              className="px-4 py-2 text-white bg-red-600 rounded-md shadow hover:bg-red-700"
            >
              Close
            </button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
