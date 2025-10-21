"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
// --- NOVOS ÍCONES ---
import {
  Search,
  Edit,
  Trash2,
  UserCog,
  Shield,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { toast } from "sonner"

// Assumindo que sua API foi atualizada
import { getAllUsers, updateUser, deleteUser } from "@/lib/api/users"

// --- NOVAS INTERFACES ---
interface User {
  id: number
  nome: string
  email: string
  role: "ADMIN" | "USER"
}

// Interface que espelha a resposta Page<T> do Spring Boot
interface PageResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  number: number // A página atual (0-indexed)
  size: number
}

// Regex simples para validação de email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PAGE_SIZE = 10 // Quantos itens por página

export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  // --- NOVO ESTADO ---
  // Guarda o valor da busca após um pequeno "delay" (debounce)
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // --- NOVOS ESTADOS DE PAGINAÇÃO ---
  const [currentPage, setCurrentPage] = useState(0) // Página atual (0-indexed)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  // Estado para o modal de Edição
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editFormData, setEditFormData] = useState({ nome: "", email: "" })
  const [editFormErrors, setEditFormErrors] = useState({ nome: "", email: "" })

  // Estado para o modal de Exclusão
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  // --- EFEITO DE DEBOUNCE ---
  // Atualiza a busca "de verdade" 500ms após o usuário parar de digitar
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setCurrentPage(0) // Volta para a primeira página ao pesquisar
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // --- EFEITO DE FETCH ---
  // Busca os usuários quando a página carregar, ou quando
  // a página atual ou a busca (debounced) mudarem.
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin")
    if (isAdmin !== "true") {
      router.push("/")
      return
    }
    fetchUsers()
  }, [router, currentPage, debouncedSearchQuery]) // Dependências atualizadas

  // --- FUNÇÃO DE FETCH ATUALIZADA ---
  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      // Agora, passamos os parâmetros para a função da API
      const data = await getAllUsers({
        page: currentPage,
        size: PAGE_SIZE,
        query: debouncedSearchQuery, // Enviando a busca para o backend
      })

      // Atualiza o estado com a resposta paginada
      setUsers(data.content)
      setTotalPages(data.totalPages)
      setTotalElements(data.totalElements)
      setCurrentPage(data.number)
    } catch (err) {
      console.error(err)
      toast.error("Falha ao carregar usuários. Tente novamente mais tarde.")
    } finally {
      setIsLoading(false)
    }
  }

  // --- REMOVIDO "filteredUsers" ---
  // A filtragem agora é feita pelo backend

  // --- Funções de Edição ---
  const handleEdit = (user: User) => {
    setEditingUser(user)
    setEditFormData({ nome: user.nome, email: user.email })
    setEditFormErrors({ nome: "", email: "" }) // Limpa erros anteriores
    setIsEditDialogOpen(true)
  }

  const validateEditForm = () => {
    // ... (função de validação sem
    // ... (função de validação sem alteração)
    const errors = { nome: "", email: "" }
    let isValid = true

    if (!editFormData.nome.trim()) {
      errors.nome = "O nome é obrigatório."
      isValid = false
    }

    if (!editFormData.email.trim()) {
      errors.email = "O email é obrigatório."
      isValid = false
    } else if (!emailRegex.test(editFormData.email)) {
      errors.email = "O formato do email é inválido."
      isValid = false
    }

    setEditFormErrors(errors)
    return isValid
  }

  // --- ATUALIZADO handleSaveEdit ---
  const handleSaveEdit = async () => {
    if (!validateEditForm()) {
      return
    }

    if (editingUser) {
      try {
        // CORREÇÃO: Faltava enviar o "role"
        await updateUser(editingUser.id, {
          nome: editFormData.nome,
          email: editFormData.email,
          role: editingUser.role, // Adicionado
        })

        toast.success("Usuário atualizado com sucesso!")
        setIsEditDialogOpen(false)
        fetchUsers() // Re-busca os dados para atualizar a tabela
      } catch (err) {
        console.error(err)
        // Lógica de erro de email duplicado (sugestão)
        const apiError = err as Error
        if (apiError.message.includes("409")) {
          setEditFormErrors({ ...editFormErrors, email: "Este email já está em uso." })
          toast.error("Este email já está em uso por outra conta.")
        } else {
          toast.error("Não foi possível atualizar o usuário: " + apiError.message)
        }
      }
    }
  }

  // --- Funções de Exclusão ---
  const openDeleteDialog = (user: User) => {
    // ... (sem alteração)
    if (user.role === "ADMIN") {
      toast.error("Não é possível remover um administrador!")
      return
    }
    setDeletingUser(user)
    setIsDeleteDialogOpen(true)
  }

  // --- ATUALIZADO handleConfirmDelete ---
  const handleConfirmDelete = async () => {
    if (!deletingUser) return

    try {
      await deleteUser(deletingUser.id)
      toast.success(`Usuário "${deletingUser.nome}" removido com sucesso!`)

      // Lógica para voltar a página se o último item for excluído
      if (users.length === 1 && currentPage > 0) {
        setCurrentPage(currentPage - 1) // Isso vai disparar o fetchUsers
      } else {
        fetchUsers() // Re-busca os dados
      }
    } catch (err) {
      console.error(err)
      toast.error("Erro ao excluir usuário. Verifique a conexão e tente novamente.")
    } finally {
      setIsDeleteDialogOpen(false)
      setDeletingUser(null)
    }
  }

  const handleCloseEditDialog = (open: boolean) => {
    // ... (sem alteração)
    setIsEditDialogOpen(open)
    if (!open) {
      setEditFormErrors({ nome: "", email: "" })
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 lg:pl-64">
        <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <PageHeader
              title="Administração"
              description="Gerencie usuários e permissões do sistema"
              icon={<Shield className="h-8 w-8 text-primary" />}
            />

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome ou email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {/* --- Badge ATUALIZADA --- */}
                  <Badge variant="outline" className="px-4 py-2">
                    {totalElements} usuário(s)
                  </Badge>
                </div>

                {/* --- Lógica de Loading/Vazio ATUALIZADA --- */}
                {isLoading ? (
                  <p className="text-center text-muted-foreground py-6">Carregando usuários...</p>
                ) : users.length === 0 ? (
                  <div className="text-center py-12">
                    <UserCog className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum usuário encontrado</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {debouncedSearchQuery
                        ? "Tente ajustar sua busca"
                        : "Não há usuários cadastrados."}
                    </p>
                  </div>
                ) : (
                  // --- Tabela ATUALIZADA (usa `users` em vez de `filteredUsers`) ---
                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Função</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.nome}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={user.role === "ADMIN" ? "default" : "outline"}>
                                {user.role === "ADMIN" ? "Admin" : "Usuário"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(user)}
                                  className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openDeleteDialog(user)}
                                  disabled={user.role === "ADMIN"}
                                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* --- SEÇÃO DE PAGINAÇÃO ADICIONADA --- */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-6">
                    <div className="text-sm text-muted-foreground">
                      Total de <span className="font-semibold">{totalElements}</span> usuário(s)
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 0}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Anterior
                      </Button>
                      <span className="text-sm font-medium">
                        Página {currentPage + 1} de {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage + 1 >= totalPages}
                      >
                        Próximo
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* --- Modais (sem alteração de layout) --- */}
      <Dialog open={isEditDialogOpen} onOpenChange={handleCloseEditDialog}>
        {/* ... (conteúdo do modal de edição sem alteração) ... */}
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>Atualize as informações do usuário</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-nome">Nome</Label>
              <Input
                id="edit-nome"
                value={editFormData.nome}
                onChange={(e) => setEditFormData({ ...editFormData, nome: e.target.value })}
                placeholder="Nome completo"
                className={editFormErrors.nome ? "border-destructive" : ""}
              />
              {editFormErrors.nome && (
                <div className="flex items-center gap-x-2 text-sm text-destructive mt-1">
                  <AlertCircle className="h-4 w-4" />
                  <p>{editFormErrors.nome}</p>
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                placeholder="email@exemplo.com"
                className={editFormErrors.email ? "border-destructive" : ""}
              />
              {editFormErrors.email && (
                <div className="flex items-center gap-x-2 text-sm text-destructive mt-1">
                  <AlertCircle className="h-4 w-4" />
                  <p>{editFormErrors.email}</p>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleCloseEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        {/* ... (conteúdo do modal de exclusão sem alteração) ... */}
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja excluir o usuário{" "}
              <span className="font-semibold text-foreground">{deletingUser?.nome}</span>?
              <br />
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Sim, Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}