# FlowTrack - Guia de Integração com Backend Spring Boot

Este guia explica como integrar o frontend FlowTrack com o backend Spring Boot.

## Estrutura da API

Todos os arquivos da API estão organizados em `lib/api/`:

\`\`\`
lib/api/
├── config.ts          # Configuração base da API
├── tasks.ts           # Endpoints de tarefas
├── categories.ts      # Endpoints de categorias
├── habits.ts          # Endpoints de hábitos
├── focus.ts           # Endpoints de foco/Pomodoro
├── mood.ts            # Endpoints de humor/bem-estar
├── reports.ts         # Endpoints de relatórios
└── index.ts           # Exportações centralizadas
\`\`\`

## Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
\`\`\`

### 2. Backend Spring Boot

Certifique-se de que seu backend Spring Boot está rodando em `http://localhost:8080` com os seguintes endpoints:

#### Tarefas
- `GET /api/tasks` - Listar todas as tarefas
- `GET /api/tasks/{id}` - Buscar tarefa por ID
- `POST /api/tasks` - Criar nova tarefa
- `PUT /api/tasks/{id}` - Atualizar tarefa
- `DELETE /api/tasks/{id}` - Deletar tarefa
- `PATCH /api/tasks/{id}/toggle` - Alternar status de conclusão

#### Categorias
- `GET /api/categories` - Listar todas as categorias
- `GET /api/categories/{id}` - Buscar categoria por ID
- `POST /api/categories` - Criar nova categoria
- `PUT /api/categories/{id}` - Atualizar categoria
- `DELETE /api/categories/{id}` - Deletar categoria

#### Hábitos
- `GET /api/habits` - Listar todos os hábitos
- `GET /api/habits/{id}` - Buscar hábito por ID
- `POST /api/habits` - Criar novo hábito
- `PUT /api/habits/{id}` - Atualizar hábito
- `DELETE /api/habits/{id}` - Deletar hábito
- `GET /api/habits/{id}/progress` - Buscar progresso do hábito
- `POST /api/habits/{id}/toggle` - Alternar conclusão do dia

#### Foco/Pomodoro
- `GET /api/focus/sessions` - Listar sessões de foco
- `GET /api/focus/sessions?date={date}` - Sessões por data
- `POST /api/focus/sessions` - Criar sessão
- `GET /api/focus/settings` - Buscar configurações
- `PUT /api/focus/settings` - Atualizar configurações
- `GET /api/focus/stats` - Estatísticas de foco

#### Humor/Bem-estar
- `GET /api/mood` - Listar registros de humor
- `GET /api/mood?startDate={start}&endDate={end}` - Por período
- `GET /api/mood/{id}` - Buscar registro por ID
- `POST /api/mood` - Criar registro
- `PUT /api/mood/{id}` - Atualizar registro
- `DELETE /api/mood/{id}` - Deletar registro
- `GET /api/mood/stats` - Estatísticas de humor

#### Relatórios
- `GET /api/reports/dashboard` - Estatísticas do dashboard
- `GET /api/reports/weekly` - Progresso semanal
- `GET /api/reports/categories` - Estatísticas por categoria
- `GET /api/reports/achievements` - Conquistas do usuário
- `GET /api/reports/productivity?startDate={start}&endDate={end}` - Relatório de produtividade

## Como Usar

### Exemplo 1: Carregar Tarefas

\`\`\`typescript
import { useEffect, useState } from "react"
import { getAllTasks, type Task } from "@/lib/api"

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTasks() {
      try {
        setLoading(true)
        const data = await getAllTasks()
        setTasks(data)
      } catch (err) {
        console.error("Erro ao carregar tarefas:", err)
        setError("Falha ao carregar tarefas")
        // Fallback para dados mockados se necessário
      } finally {
        setLoading(false)
      }
    }
    
    loadTasks()
  }, [])

  // ... resto do componente
}
\`\`\`

### Exemplo 2: Criar Nova Tarefa

\`\`\`typescript
import { createTask } from "@/lib/api"

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  try {
    const newTask = await createTask({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      dueDate: formData.dueDate,
      completed: false
    })
    
    setTasks([...tasks, newTask])
    resetForm()
  } catch (error) {
    console.error("Erro ao criar tarefa:", error)
    // Mostrar mensagem de erro ao usuário
  }
}
\`\`\`

### Exemplo 3: Atualizar Tarefa

\`\`\`typescript
import { updateTask } from "@/lib/api"

const handleEdit = async (taskId: number, updates: Partial<Task>) => {
  try {
    const updatedTask = await updateTask(taskId, updates)
    setTasks(tasks.map(t => t.id === taskId ? updatedTask : t))
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error)
  }
}
\`\`\`

### Exemplo 4: Deletar Tarefa

\`\`\`typescript
import { deleteTask } from "@/lib/api"

const handleDelete = async (taskId: number) => {
  try {
    await deleteTask(taskId)
    setTasks(tasks.filter(t => t.id !== taskId))
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error)
  }
}
\`\`\`

## Estratégia de Migração

### Fase 1: Preparação
1. ✅ Estrutura de API criada
2. ✅ Interfaces TypeScript definidas
3. ✅ Documentação completa

### Fase 2: Integração Gradual
Para cada página/módulo:

1. **Manter dados mockados como fallback**
   \`\`\`typescript
   const mockTasks = [/* dados mockados */]
   
   useEffect(() => {
     async function loadTasks() {
       try {
         const data = await getAllTasks()
         setTasks(data)
       } catch (error) {
         console.warn("Usando dados mockados:", error)
         setTasks(mockTasks) // Fallback
       }
     }
     loadTasks()
   }, [])
   \`\`\`

2. **Adicionar estados de loading e erro**
   \`\`\`typescript
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)
   \`\`\`

3. **Testar cada endpoint individualmente**
   - Verificar se o backend está respondendo
   - Validar formato dos dados
   - Testar casos de erro

4. **Remover dados mockados após validação**
   - Apenas quando o backend estiver estável
   - Manter tratamento de erros

### Fase 3: Produção
1. Configurar variável de ambiente de produção
2. Adicionar retry logic para requisições
3. Implementar cache quando apropriado
4. Monitorar erros de API

## Tratamento de Erros

Todas as funções da API já incluem tratamento básico de erros. Você pode adicionar lógica adicional:

\`\`\`typescript
try {
  const data = await getAllTasks()
  setTasks(data)
} catch (error) {
  if (error instanceof Error) {
    if (error.message.includes("404")) {
      // Recurso não encontrado
    } else if (error.message.includes("500")) {
      // Erro do servidor
    } else {
      // Erro de rede ou outro
    }
  }
  
  // Mostrar toast de erro ao usuário
  toast.error("Falha ao carregar tarefas")
}
\`\`\`

## CORS

Certifique-se de que seu backend Spring Boot permite requisições do frontend:

\`\`\`java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                .allowedHeaders("*");
    }
}
\`\`\`

## Próximos Passos

1. **Iniciar o backend Spring Boot** em `localhost:8080`
2. **Testar endpoints** usando Postman ou similar
3. **Migrar uma página por vez** começando pelas mais simples (ex: categorias)
4. **Validar dados** retornados pela API
5. **Adicionar autenticação** quando necessário
6. **Deploy** quando tudo estiver funcionando

## Suporte

Se encontrar problemas:
1. Verifique se o backend está rodando
2. Confira os logs do console do navegador
3. Valide o formato dos dados retornados
4. Teste os endpoints diretamente com curl ou Postman

---

**Nota**: O frontend está completamente funcional com dados mockados. A integração com o backend pode ser feita gradualmente sem quebrar a aplicação existente.
