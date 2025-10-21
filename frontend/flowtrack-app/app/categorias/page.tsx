"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Trash2, Edit, FolderKanban } from "lucide-react"

interface Category {
  id: string
  name: string
  color: string
  taskCount: number
}

const colorOptions = [
  { value: "bg-blue-500", label: "Azul" },
  { value: "bg-purple-500", label: "Roxo" },
  { value: "bg-green-500", label: "Verde" },
  { value: "bg-orange-500", label: "Laranja" },
  { value: "bg-pink-500", label: "Rosa" },
  { value: "bg-red-500", label: "Vermelho" },
  { value: "bg-yellow-500", label: "Amarelo" },
  { value: "bg-teal-500", label: "Azul-petróleo" },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([
    { id: "trabalho", name: "Trabalho", color: "bg-blue-500", taskCount: 8 },
    { id: "estudo", name: "Estudo", color: "bg-purple-500", taskCount: 5 },
    { id: "saude", name: "Saúde", color: "bg-green-500", taskCount: 3 },
    { id: "lazer", name: "Lazer", color: "bg-orange-500", taskCount: 2 },
    { id: "pessoal", name: "Pessoal", color: "bg-pink-500", taskCount: 4 },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    color: "bg-blue-500",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCategory) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, name: formData.name, color: formData.color } : cat,
        ),
      )
    } else {
      const newCategory: Category = {
        id: formData.name.toLowerCase().replace(/\s+/g, "-"),
        name: formData.name,
        color: formData.color,
        taskCount: 0,
      }
      setCategories([...categories, newCategory])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({ name: "", color: "bg-blue-500" })
    setEditingCategory(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      color: category.color,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id))
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 lg:pl-64">
        <div className="container max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <PageHeader
            title="Categorias"
            description="Organize suas tarefas em categorias personalizadas"
            action={
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingCategory(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Categoria
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <form onSubmit={handleSubmit}>
                    <DialogHeader>
                      <DialogTitle>{editingCategory ? "Editar Categoria" : "Nova Categoria"}</DialogTitle>
                      <DialogDescription>
                        {editingCategory
                          ? "Atualize as informações da categoria"
                          : "Crie uma nova categoria para organizar suas tarefas"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Nome</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ex: Trabalho, Estudo, Pessoal"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Cor</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {colorOptions.map((color) => (
                            <button
                              key={color.value}
                              type="button"
                              onClick={() => setFormData({ ...formData, color: color.value })}
                              className={`h-12 rounded-lg border-2 transition-all ${color.value} ${
                                formData.color === color.value
                                  ? "border-foreground scale-105"
                                  : "border-transparent hover:scale-105"
                              }`}
                              title={color.label}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={resetForm}>
                        Cancelar
                      </Button>
                      <Button type="submit">{editingCategory ? "Atualizar" : "Criar"}</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            }
          />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg ${category.color} flex items-center justify-center`}>
                        <FolderKanban className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {category.taskCount} {category.taskCount === 1 ? "tarefa" : "tarefas"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(category)} className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(category.id)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {categories.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <FolderKanban className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhuma categoria criada ainda</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Crie sua primeira categoria para organizar suas tarefas
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
