import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Construction } from "lucide-react"

interface UnderConstructionProps {
  title?: string
  description?: string
  showBackButton?: boolean
}

export function UnderConstruction({
  title = "Em Construção",
  description = "Esta página ainda está em desenvolvimento, volte em breve!",
  showBackButton = true,
}: UnderConstructionProps) {
  return (
    // O 'div' com 'min-h-[60vh]' e 'flex' foi REMOVIDO.
    // A página agora controla o posicionamento.
    <Card className="max-w-lg w-full border-2 shadow-xl">
      <CardContent className="pt-12 pb-10 text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse">
              <Construction className="h-14 w-14 text-primary animate-bounce" style={{ animationDuration: "2s" }} />
            </div>
            <div className="absolute -top-3 -right-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent to-secondary animate-bounce shadow-lg">
              <span className="text-2xl">🚧</span>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">{title}</h2>
        <p className="text-muted-foreground text-lg mb-10 text-balance leading-relaxed max-w-md mx-auto">
          {description}
        </p>

        {showBackButton && (
          <div className="space-y-4">
            <Button asChild size="lg" className="w-full max-w-xs shadow-lg">
              <Link href="/">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Voltar ao Dashboard
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">Estamos trabalhando para trazer novidades em breve</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default UnderConstruction