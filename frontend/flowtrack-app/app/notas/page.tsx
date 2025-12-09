"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Edit, Search, Archive, Clock } from "lucide-react"
import { getNotes, createNote, editNote, deleteNote, toggleArchiveNote } from "@/lib/api/notas";

interface Note {
  id: number
  title: string
  content: string
  color: "blue" | "yellow" | "green" | "red" | "purple"
  archived: boolean
  createdAt: string
  updatedAt: string
}

const colorOptions = [
  { id: "blue", name: "Azul", bg: "bg-blue-500/10", text: "text-blue-700", border: "border-blue-200" },
  { id: "yellow", name: "Amarelo", bg: "bg-yellow-500/10", text: "text-yellow-700", border: "border-yellow-200" },
  { id: "green", name: "Verde", bg: "bg-green-500/10", text: "text-green-700", border: "border-green-200" },
  { id: "red", name: "Vermelho", bg: "bg-red-500/10", text: "text-red-700", border: "border-red-200" },
  { id: "purple", name: "Roxo", bg: "bg-purple-500/10", text: "text-purple-700", border: "border-purple-200" },
]

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [showArchived, setShowArchived] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    color: "blue" as "blue" | "yellow" | "green" | "red" | "purple",
  })

  useEffect(() => {
    const openDialog = localStorage.getItem("openNewNoteDialog")
    if (openDialog === "true") {
      setIsDialogOpen(true)
      localStorage.removeItem("openNewNoteDialog")
    }
  }, [])

  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    try {
      const data = await getNotes()
      console.log("Notas carregadas: ", data)
      setNotes(data)
    } catch (error) {
      console.error("Erro ao carregar notas:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingNote) {
        console.log("Antes de chamar a edição: ", formData)        
        const updatedNote = await editNote(editingNote.id, formData)
        console.log("Depois de chamar a edição: ", updatedNote)

        setNotes((prevNotes) =>
          prevNotes.map((note) => (note.id === editingNote.id ? updatedNote : note))
        )
      } else {
        console.log("Antes de chamar a criação: ", formData)
        const newNote = await createNote(formData)
        console.log("depois de chamar a criação: ", newNote)
        
        setNotes((prevNotes) => [newNote, ...prevNotes])
      }
      
      resetForm()
    } catch (error) {
      console.error("Erro ao salvar nota:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      color: "blue",
    })
    setEditingNote(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (note: Note) => {
    setEditingNote(note)
    setFormData({
      title: note.title,
      content: note.content,
      color: note.color,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteNote(id)
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id))
    } catch (error) {
      console.error("Erro ao deletar nota:", error)
    }
  }

  const toggleArchive = async (id: number) => {
    try {
      await toggleArchiveNote(id)
      
      setNotes((prevNotes) =>
        prevNotes.map((note) => 
          note.id === id ? { ...note, archived: !note.archived } : note
        )
      )
    } catch (error) {
      console.error("Erro ao arquivar nota:", error)
    }
  }

  const getColorStyles = (color: string) => {
    return colorOptions.find((c) => c.id === color) || colorOptions[0]
  }

  const filteredNotes = notes.filter((note) => {
    const searchMatch =
      searchQuery === "" ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())

    const archivedMatch = showArchived === note.archived

    return searchMatch && archivedMatch
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ontem"
    } else {
      return date.toLocaleDateString("pt-BR")
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 lg:pl-64">
        <div className="w-full py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <PageHeader
              title="Notas"
              description="Capture ideias, pensamentos e rascunhos rapidamente"
              action={
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingNote(null)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Nota
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <form onSubmit={handleSubmit}>
                      <DialogHeader>
                        <DialogTitle>{editingNote ? "Editar Nota" : "Nova Nota"}</DialogTitle>
                        <DialogDescription>
                          {editingNote ? "Atualize sua nota" : "Crie uma nova nota para capturar suas ideias"}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="title">Título</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Ex: Ideias para o projeto..."
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="content">Conteúdo</Label>
                          <Textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            placeholder="Escreva suas notas aqui..."
                            rows={5}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label>Cor</Label>
                          <div className="flex gap-2">
                            {colorOptions.map((color) => (
                              <button
                                key={color.id}
                                type="button"
                                onClick={() =>
                                  setFormData({
                                    ...formData,
                                    color: color.id as "blue" | "yellow" | "green" | "red" | "purple",
                                  })
                                }
                                className={`h-8 w-8 rounded-full border-2 transition-transform ${
                                  formData.color === color.id
                                    ? `border-foreground scale-110`
                                    : `border-muted-foreground/30 hover:scale-105`
                                } ${color.bg}`}
                                title={color.name}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={resetForm}>
                          Cancelar
                        </Button>
                        <Button type="submit">{editingNote ? "Atualizar" : "Criar"}</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              }
            />

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar notas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant={showArchived ? "default" : "outline"}
                onClick={() => setShowArchived(!showArchived)}
                className="sm:w-auto"
              >
                <Archive className="h-4 w-4 mr-2" />
                {showArchived ? "Arquivadas" : "Ativas"}
              </Button>
            </div>

            {filteredNotes.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    {searchQuery ? "Nenhuma nota encontrada" : "Nenhuma nota criada"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredNotes.map((note) => {
                  const colorStyle = getColorStyles(note.color)
                  return (
                    <Card
                      key={note.id}
                      className={`border-l-4 ${colorStyle.border} hover:shadow-lg transition-all cursor-pointer ${colorStyle.bg}`}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="text-lg font-semibold text-foreground line-clamp-2">{note.title}</h3>
                          <div className="flex gap-2 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleArchive(note.id)}
                              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                              title={note.archived ? "Desarquivar" : "Arquivar"}
                            >
                              <Archive className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(note)}
                              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(note.id)}
                              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <p className="text-sm text-foreground/80 line-clamp-4 whitespace-pre-wrap mb-4">
                          {note.content}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-current/10">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDate(note.updatedAt)}
                          </div>
                          {note.archived && (
                            <Badge variant="outline" className="text-xs">
                              Arquivada
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
