import { memo } from "react";
import meAvatar from "@/assets/me-avatar.png";
import youAvatar from "@/assets/you-avatar.png";

interface AvatarProps {
  author: "me" | "them";
  name: string;
  className?: string;
}

export const Avatar = memo(function Avatar({ author, name }: AvatarProps) {
  const isHarish = author === "me";
  const avatarSrc = isHarish ? meAvatar : youAvatar;

  return (
    <div
      className="relative shrink-0 rounded-full overflow-hidden h-10 w-10 sm:h-12 sm:w-12 select-none"
      aria-hidden
    >
      <img
        src={avatarSrc}
        alt={name}
        loading="eager"
        decoding="async"
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
});
