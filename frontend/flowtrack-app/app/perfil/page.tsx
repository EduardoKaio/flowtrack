import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { UnderConstruction } from "@/components/under-construction"

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 lg:pl-64 flex flex-col">

        {/* 1. PageHeader no topo */}
        <div className="container max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
          <PageHeader title="Perfil" description="Gerencie suas informações pessoais" />
        </div>

        {/* 2. Div que ocupa o espaço restante (flex-1) e centraliza o card */}
        <div className="flex-0 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <UnderConstruction
            title="Perfil em Construção"
            description="Em breve você poderá editar seu perfil, foto e preferências pessoais."
          />
        </div>

      </main>
    </div>
  )
}