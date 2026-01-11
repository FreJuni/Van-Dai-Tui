'use client';

import React from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from 'react';
import { toast } from 'react-toastify';
import { AdminResetPasswordAction, ChangeRoleAction, DeleteUserAction } from '@/server/actions/admin-user';
interface ActionDropDownProps {
  children: React.ReactNode;
  currentUser: {
    id: string;
    name: string;
    address: string;
    role: string;
    phone_number: string;
    isOAuth: boolean;
  };
  user: {
    id: string;
    name: string | null;
    address: string | null;
    password: string | null;
    phone_number: string | null;
    addressVerified: Date | null;
    image: string | null;
    role: 'user' | 'admin' | null;
  };
}

const ActionDropdown = ({
  children,
  currentUser,
  user,
}: ActionDropDownProps) => {
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleResetPassword = async () => {
        setIsLoading(true);
        const response = await AdminResetPasswordAction({ userId: user.id, password });
        if (response.success) {
            toast.success(response.success);
            setOpen(false);
            setPassword("");
        }
        if (response.error) {
            toast.error(response.error);
        }
        setIsLoading(false);
    }
  const handleDeleteUser = async (userId: string) => {
    const response = await DeleteUserAction({ userId });
    if (response.success) {
      toast.success(response.success);
    }

    if (response.error) {
      toast.error(response.error);
    }
  };

  const handleChangeRole = async (userId: string) => {
    const response = await ChangeRoleAction({ userId });
    if (response.success) {
      toast.success(response.success);
    }

    if (response.error) {
      toast.error(response.error);
    }
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top">
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="hover:text-primary cursor-pointer"
              onClick={() => handleChangeRole(user.id)}
            >
              {user.role === 'admin' ? 'Change To User' : 'Change To Admin'}
            </DropdownMenuItem>
            <DropdownMenuItem
                className="hover:text-primary cursor-pointer"
                onSelect={(e) => e.preventDefault()}
                onClick={() => setOpen(true)}
            >
                Reset Password
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteUser(user.id)}
              className={cn(
                'cursor-pointer text-red-500 hover:text-red-600!',
                user.id === currentUser.id && 'hidden'
              )}
            >
              Delete User
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Reset Password</DialogTitle>
                <DialogDescription>
                    Enter the new password for this user.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                        Password
                    </Label>
                    <Input
                        id="password"
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="col-span-3"
                    />
                </div>
            </div>
            <DialogFooter>
                <Button className='cursor-pointer' disabled={isLoading} onClick={handleResetPassword} type="submit">Save changes</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActionDropdown;
