"use client";

import type React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { PasswordInputField } from "./passwordInputField";
import useChangePass from "../../hooks/auth/useChangePass";

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ChangePassword({ isOpen, onClose }: PasswordChangeModalProps) {
  const {
    form,
    showCurrentPassword,
    showNewPassword,
    showConfirmPassword,
    isLoading,
    onSubmit,
    setShowCurrentPassword,
    setShowNewPassword,
    setShowConfirmPassword,
  } = useChangePass(onClose);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and a new password to update your
            credentials.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => onSubmit(data))}
            className="space-y-6"
          >
            <PasswordInputField
              form={form}
              showPassword={showCurrentPassword}
              setShowPassword={setShowCurrentPassword}
              name="currentPassword"
              placeholder="Type your current password"
              label="Current Password"
            />
            <PasswordInputField
              form={form}
              showPassword={showNewPassword}
              setShowPassword={setShowNewPassword}
              name="newPassword"
              placeholder="Type your new password"
              label="New Password"
            />
            <PasswordInputField
              form={form}
              showPassword={showConfirmPassword}
              setShowPassword={setShowConfirmPassword}
              name="confirmPassword"
              placeholder="Type your confirm password"
              label="Confirm Password"
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  className="cursor-pointer"
                  type="button"
                  variant="outline"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                className="cursor-pointer"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ChangePassword;
