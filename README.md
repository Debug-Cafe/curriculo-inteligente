# Currículo Inteligente

Sistema completo para criação de currículos profissionais com múltiplos templates, autenticação de usuários e integração backend.

## 🚀 Tecnologias

- **React 18** + **TypeScript** + **Vite**
- **CSS Inline** (sem frameworks CSS)
- **Context API** para gerenciamento de estado
- **Fetch API** para requisições HTTP

## 📋 Funcionalidades

### ✅ Sistema de Autenticação
- Login e registro de usuários
- Proteção de rotas
- Gerenciamento de sessão com localStorage
- Validação de formulários

### ✅ Criação de Currículos
- **6 etapas**: Dados Pessoais, Habilidades, Experiência, Educação, Objetivos, Template
- **Auto-save** em tempo real
- **Validação** de campos obrigatórios
- **Barra de progresso** visual

### ✅ Templates Profissionais
- **6 templates**: Modern, Classic, Creative, Minimal, Professional, Elegant
- **Preview em tempo real**
- **Seletor moderno** com dropdown

### ✅ Temas e UX
- **Dark/Light mode** completo
- **Animações** suaves
- **Diálogos modernos** (sem alerts do browser)
- **Atalhos de teclado**
- **Export PDF** (funcionalidade preparada)

## 🏗️ Arquitetura

### Estrutura de Pastas
```
src/
├── components/          # Componentes reutilizáveis
├── contexts/           # Context API (Auth)
├── pages/              # Páginas principais
├── services/           # APIs e integrações
├── types/              # TypeScript interfaces
└── main.tsx           # Entry point
```

### Componentes Principais

#### Formulários
- `PersonalDataForm` - Dados pessoais com validação
- `SkillsForm` - Gerenciamento de habilidades
- `ExperienceForm` - Histórico profissional
- `EducationForm` - Formação acadêmica
- `ObjectivesForm` - Objetivos de carreira

#### UI/UX
- `ResumePreview` - Preview em tempo real
- `TemplateSelector` - Seleção de templates
- `ConfirmDialog` - Diálogos modernos
- `LoadDialog` - Seleção de currículos

#### Autenticação
- `LoginForm` / `RegisterForm` - Formulários de auth
- `AuthContext` - Gerenciamento de estado global

## 🔧 Decisões Técnicas

### Por que CSS Inline ao invés de TailwindCSS?

1. **Temas Dinâmicos**: CSS inline permite mudança de cores em tempo real via JavaScript
2. **Performance**: Sem CSS adicional para carregar
3. **Flexibilidade**: Animações e estados complexos mais fáceis de gerenciar
4. **Controle Total**: Cada componente tem controle completo sobre seu estilo
5. **Bundle Size**: Menor tamanho final da aplicação

### Por que useRef ao invés de useState?

1. **Performance**: Evita re-renders desnecessários
2. **UX**: Elimina delay na digitação
3. **Simplicidade**: Menos código para gerenciar estado

## 🌐 APIs e Integração Backend

### Endpoints de Autenticação

```typescript
// POST /auth/login
{
  email: string;
  password: string;
}
// Response: { user: User, token: string }

// POST /auth/register  
{
  name: string;
  email: string;
  password: string;
}
// Response: { user: User, token: string }

// GET /auth/me
// Headers: Authorization: Bearer <token>
// Response: User
```

### Endpoints de Currículos

```typescript
// GET /resumes
// Headers: Authorization: Bearer <token>
// Response: Resume[]

// POST /resumes
// Headers: Authorization: Bearer <token>
// Body: Resume
// Response: Resume

// PUT /resumes/:id
// Headers: Authorization: Bearer <token>
// Body: Resume
// Response: Resume

// DELETE /resumes/:id
// Headers: Authorization: Bearer <token>
// Response: void
```

### Modelos de Dados

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface Resume {
  id?: string;
  userId?: string;
  personalData: PersonalData;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  objectives: string;
  template: string;
  createdAt?: string;
  updatedAt?: string;
}
```

## ⚙️ Configuração e Instalação

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
```bash
# .env
REACT_APP_API_URL=http://localhost:3001/api
```

### 3. Executar em Desenvolvimento
```bash
npm run dev
```

### 4. Build para Produção
```bash
npm run build
```

## 🔌 Integração com Backend

### Arquivos Modificados para Integração

**1. `src/services/authApi.ts`**
- Remove simulação mock
- Adiciona requisições HTTP reais
- Gerencia tokens JWT

**2. `src/services/api.ts`**
- Remove localStorage fallback
- Adiciona autenticação Bearer
- CRUD completo de currículos

### Backend Requirements

O backend deve implementar:

1. **Autenticação JWT**
   - Registro e login de usuários
   - Validação de tokens
   - Middleware de autenticação

2. **CRUD de Currículos**
   - Associação usuário-currículo
   - Validação de dados
   - Controle de acesso

3. **CORS Configuration**
   ```javascript
   // Permitir origem do frontend
   origin: 'http://localhost:5173'
   ```

### Exemplo de Integração (Node.js/Express)

```javascript
// Backend structure example
app.post('/api/auth/login', authController.login);
app.post('/api/auth/register', authController.register);
app.get('/api/auth/me', authMiddleware, authController.me);

app.get('/api/resumes', authMiddleware, resumeController.list);
app.post('/api/resumes', authMiddleware, resumeController.create);
app.put('/api/resumes/:id', authMiddleware, resumeController.update);
app.delete('/api/resumes/:id', authMiddleware, resumeController.delete);
```

## 🎯 Próximos Passos

1. **PDF Export**: Implementar geração real de PDF
2. **Compartilhamento**: URLs públicas para currículos
3. **Templates Customizáveis**: Editor de templates
4. **Analytics**: Métricas de visualização
5. **Integração IA**: Sugestões automáticas de conteúdo

## 📝 Notas de Desenvolvimento

- **Auto-save**: Salva automaticamente a cada mudança
- **Validação**: Campos obrigatórios destacados em vermelho
- **Responsivo**: Layout adaptável para mobile
- **Acessibilidade**: Labels e navegação por teclado
- **Performance**: Componentes otimizados com useRef

---

**Desenvolvido com foco em UX moderna e integração backend seamless.**