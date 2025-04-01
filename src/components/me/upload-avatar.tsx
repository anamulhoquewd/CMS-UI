import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Camera } from "lucide-react";
import { useRef } from "react";
import useAvatar from "../../hooks/auth/useAvatar";
import useGetMe from "@/hooks/auth/useGetMe";

export function UploadAvatar() {
  const { uploadHandler, error, setError, isAvatarOpen, setIsAvatarOpen } =
    useAvatar();

  const { user } = useGetMe();

  // input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Click the input element when the button is clicked
  const inputClickHandler = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="relative">
      <Avatar className="h-24 w-24">
        <AvatarImage
          className="w-auto h-full object-cover"
          src={user ? user.avatar : ""}
          alt="Profile picture"
        />
        <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold select-none">
          {user
            ? user.name
                .split(" ")
                .map((name) => name[0])
                .join("")
                .toUpperCase()
            : "JD"}
        </AvatarFallback>
      </Avatar>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsAvatarOpen(true)}
        className="absolute bottom-0 right-0 h-8 w-8 rounded-full cursor-pointer"
      >
        <Camera className="h-4 w-4" />
      </Button>

      <Dialog
        open={isAvatarOpen}
        onOpenChange={(open) => {
          setIsAvatarOpen(open);
          setError("");
        }}
      >
        <DialogContent className="w-[90vw] sm:max-w-[425px] bg-secondary text-secondary-foreground rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              Change Avatar
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-48 h-48">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold select-none">
                  {user
                    ? user.name
                        .split(" ")
                        .map((name) => name[0])
                        .join("")
                        .toUpperCase()
                    : "JD"}
                </AvatarFallback>
                <AvatarImage
                  className="w-auto h-full object-cover"
                  alt="Avatar preview"
                  src={user ? user.avatar : ""}
                />
              </Avatar>
              <div className="flex flex-col items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={inputClickHandler}
                >
                  Select New Avatar
                </Button>
                <span className="text-xs text-red-500 select-none">
                  {error}
                </span>
                <span className="text-xs text-muted-foreground select-none">
                  Auto update when you upload an image
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Input
        id="avatar-upload"
        type="file"
        accept="image/jpeg, image/png, image/jpg"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => uploadHandler(e)}
      />
    </div>
  );
}
