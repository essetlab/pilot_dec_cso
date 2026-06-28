import { PlaceholderPage } from "@/components/shell/PlaceholderPage";
import { ActionButton, AlertMessage } from "@/components/ui";

type PageProps = {
  searchParams: Promise<{
    from?: string;
  }>;
};

export default async function UnauthorizedPage({ searchParams }: PageProps) {
  await searchParams;

  return (
    <PlaceholderPage
      purpose="Show a safe message when an account does not have access to an area."
      route="/unauthorized"
      section="Public"
      title="Access Needed"
    >
      <div className="rounded-card border border-design-border bg-white-surface p-6 shadow-soft">
        <AlertMessage tone="warning" title="You do not have access to this area">
          Please sign in with an account that has the required permission.
        </AlertMessage>
        <div className="mt-5 flex flex-wrap gap-3">
          <ActionButton href="/sign-in">Sign in</ActionButton>
          <ActionButton href="/" variant="secondary">
            Return home
          </ActionButton>
        </div>
      </div>
    </PlaceholderPage>
  );
}
