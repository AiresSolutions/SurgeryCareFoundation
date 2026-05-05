import { HeaderAuth } from "@/components/layout/header-auth";
import { Footer } from "@/components/layout/footer";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Container } from "@/components/ui/container";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white">
        Skip to main content
      </a>
      <HeaderAuth />
      <main id="main-content" className="py-8 md:py-12">
        <Container>
          <AuthGuard>
            <div className="flex flex-col gap-8 lg:flex-row">
              <AdminSidebar />
              <div className="min-w-0 flex-1">{children}</div>
            </div>
          </AuthGuard>
        </Container>
      </main>
      <Footer />
    </>
  );
}
