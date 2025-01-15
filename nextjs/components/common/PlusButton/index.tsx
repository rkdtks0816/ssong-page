import React from "react";
import { PlusButtonContainer } from "./styles";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";

const PlusButton: React.FC<{ paths: string }> = ({ paths }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  return (
    <PlusButtonContainer
      $isAuthenticated={isAuthenticated === true}
      onClick={() => router.push(paths)}
    >
      +
    </PlusButtonContainer>
  );
};

export default PlusButton;
