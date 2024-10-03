import { useLogout } from "@/lib/useLogout";
import { Button } from "./Button";

interface LogoutButtonProps {
  label?: string;
  variant?: "primary" | "secondary";
}

export const LogoutButton = ({ label, variant }: LogoutButtonProps) => {
  const logout = useLogout();

  return (
    <Button variant={variant ?? "secondary"} onClick={logout}>
      {label ?? "Try another wallet"}
    </Button>
  );
};
