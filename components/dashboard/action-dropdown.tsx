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

import { toast, ToastContainer } from 'react-toastify';
import { ChangeRoleAction, DeleteUserAction } from '@/server/actions/admin-user';
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
      <ToastContainer />
    </>
  );
};

export default ActionDropdown;
