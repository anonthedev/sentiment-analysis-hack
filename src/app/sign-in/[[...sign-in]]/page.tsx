import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return(
  <main className='w-screen h-screen flex flex-col items-center justify-center'>
    <SignIn />
  </main>)
}