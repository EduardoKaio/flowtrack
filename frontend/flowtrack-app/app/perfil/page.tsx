"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Sidebar } from "@/components/sidebar"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, User, Calendar, MapPin, Save, Lock, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { getProfile, updateProfile, uploadAvatar, changePassword, type Profile, type ProfileUpdate, type PasswordChange } from "@/lib/api/profile"

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    nome: "",
    bio: "",
    location: "",
    telefone: "",
    endereco: "",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setIsLoading(true)
      const data = await getProfile()
      setProfile(data)
      setFormData({
        nome: data.nome || "",
        bio: data.bio || "",
        location: data.location || "",
        telefone: data.telefone || "",
        endereco: data.endereco || "",
      })
    } catch (error: any) {
      console.error("Erro ao carregar perfil:", error)
      toast.error(error.message || "Erro ao carregar perfil")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      toast.error("Apenas imagens são permitidas (JPEG, PNG, GIF, WEBP)")
      return
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB")
      return
    }

    try {
      const result = await uploadAvatar(file)
      toast.success("Foto de perfil atualizada!")
      await loadProfile() // Recarregar perfil
    } catch (error: any) {
      console.error("Erro ao fazer upload:", error)
      toast.error(error.message || "Erro ao fazer upload da imagem")
    }
  }

  const handleSave = async () => {
    try {
      const updateData: ProfileUpdate = {
        nome: formData.nome,
        bio: formData.bio,
        location: formData.location,
        telefone: formData.telefone,
        endereco: formData.endereco,
      }

      await updateProfile(updateData)
      toast.success("Perfil atualizado com sucesso!")
      setIsEditing(false)
      await loadProfile()
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error)
      toast.error(error.message || "Erro ao atualizar perfil")
    }
  }

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("Preencha todos os campos de senha!")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("As senhas não coincidem!")
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres!")
      return
    }

    try {
      const passwordChangeData: PasswordChange = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }

      await changePassword(passwordChangeData)
      toast.success("Senha alterada com sucesso!")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setIsChangingPassword(false)
    } catch (error: any) {
      console.error("Erro ao alterar senha:", error)
      toast.error(error.message || "Erro ao alterar senha")
    }
  }

  const getInitials = () => {
    if (!profile) return "U"
    return profile.nome
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarUrl = () => {
    if (!profile?.avatarUrl) return "/placeholder.svg"
    // Se a URL já for completa, retornar como está
    if (profile.avatarUrl.startsWith("http")) {
      return profile.avatarUrl
    }
    // Caso contrário, construir URL completa
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
    return `${API_BASE_URL}${profile.avatarUrl}`
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:pl-64">
          <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center">Carregando perfil...</div>
          </div>
        </main>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:pl-64">
          <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center text-red-600">Erro ao carregar perfil</div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 lg:pl-64">
        <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <PageHeader title="Perfil" description="Gerencie suas informações pessoais" />

          <div className="space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative group">
                    <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                      <AvatarImage src={getAvatarUrl()} alt={profile.nome} />
                      <AvatarFallback className="text-3xl font-bold">{getInitials()}</AvatarFallback>
                    </Avatar>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera className="h-8 w-8 text-white" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-3xl font-bold text-foreground">{profile.nome}</h2>
                    <p className="text-muted-foreground mt-1">{profile.email}</p>
                    <div className="flex flex-wrap gap-3 mt-4 justify-center sm:justify-start">
                      {profile.joinDate && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Membro desde {new Date(profile.joinDate).toLocaleDateString("pt-BR")}
                        </div>
                      )}
                      {profile.location && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {profile.location}
                        </div>
                      )}
                    </div>
                  </div>
                  {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} className="shrink-0">
                      <User className="h-4 w-4 mr-2" />
                      Editar Perfil
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Profile Information */}
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>Atualize seus dados e informações de contato</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      placeholder="seu@email.com"
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Localização</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Cidade, País"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Conte um pouco sobre você..."
                    rows={4}
                  />
                </div>

                {isEditing && (
                  <div className="flex gap-3 justify-end pt-4">
                    <Button variant="outline" onClick={() => {
                      setIsEditing(false)
                      loadProfile() // Recarregar dados originais
                    }}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Password Change Section */}
            <Card>
              <CardHeader>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>Altere sua senha para manter sua conta segura</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isChangingPassword ? (
                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                        <Lock className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Senha</p>
                        <p className="text-sm text-muted-foreground">Última alteração há 30 dias</p>
                      </div>
                    </div>
                    <Button onClick={() => setIsChangingPassword(true)} variant="outline">
                      Alterar Senha
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Senha Atual</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          placeholder="Digite sua senha atual"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nova Senha</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          placeholder="Digite sua nova senha"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">Mínimo de 6 caracteres</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          placeholder="Confirme sua nova senha"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsChangingPassword(false)
                          setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handlePasswordChange}>
                        <Lock className="h-4 w-4 mr-2" />
                        Alterar Senha
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
