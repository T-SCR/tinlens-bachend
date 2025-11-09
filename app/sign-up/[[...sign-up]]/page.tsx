import Image from "next/image";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="mb-2 flex items-center justify-center gap-3">
          <Image
            src="/Untitled (200 x 50 mm) (5).png"
            alt="TinLens logo"
            width={160}
            height={40}
            className="h-10 w-auto dark:hidden"
            priority
          />
          <Image
            src="/Untitled (200 x 50 mm) (4).png"
            alt="TinLens logo"
            width={160}
            height={40}
            className="hidden h-10 w-auto dark:block"
            priority
          />
        </div>
        <SignUp />
      </div>
    </div>
  );
}
