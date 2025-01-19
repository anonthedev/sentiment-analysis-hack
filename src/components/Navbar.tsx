import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="bg-[#F2F1E8] w-screen h-[80px] flex flex-row items-center justify-between px-24">
      <Link href="/" className="text-2xl font-bold">
        Sentiora
      </Link>
      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <div className="flex flex-row gap-4 items-center justify-center">
            <Button asChild>
              <Link href={`/reviews`}>Dashboard</Link>
            </Button>
            <Button asChild variant={"outline"}>
              <Link href={`/input`}>Add Data</Link>
            </Button>
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </nav>
  );
}
