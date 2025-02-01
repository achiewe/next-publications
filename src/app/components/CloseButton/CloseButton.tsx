import React from "react";
import { useRouter } from "next/navigation";

export default function CloseButton() {
  const router = useRouter();
  return (
    <button
      className="w-[80px] h-[30px] bg-red-400 text-[18px]"
      onClick={() => {
        router.push("/");
      }}
    >
      Back
    </button>
  );
}
