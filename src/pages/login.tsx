import Head from "next/head";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <main className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
        <LoginForm />
      </main>
    </>
  );
}
