import { ResetPasswordForm } from "../../../../components/auth/resetForm";

function ResetPassword() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Reset Password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create a new password for your account
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
}

export default ResetPassword;
