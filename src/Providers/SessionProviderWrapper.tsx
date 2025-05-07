import { auth } from "@/auth";
import Provider from "@/Providers/Provider";

export default async function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth(); // Fetch the session in a separate server component
  return <Provider session={session || undefined}>{children}</Provider>;
}
