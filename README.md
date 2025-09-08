# Currículo Inteligente

Sistema completo para criação de currículos profissionais com múltiplos templates, autenticação de usuários e integração backend.

## 🚀 Tecnologias

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **CSS Inline** (sem frameworks CSS)
- **Context API** para gerenciamento de estado
- **Fetch API** para requisições HTTP

### Backend
- **Node.js** + **TypeScript**
- **Express.js** para API REST
- **JWT** para autenticação
- **Middleware** de segurança

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
- **Barra de progresso** visual com rosa da marca

### ✅ Templates Profissionais
- **6 templates**: Modern, Classic, Creative, Minimal, Professional, Elegant
- **Preview em tempo real**
- **Seletor moderno** com dropdown

### ✅ Temas e UX
- **Dark/Light mode** completo
- **Sistema de cores semântico**:
  - Primário (azul #2563EB): Salvar, Adicionar, Login/Registro
  - Sucesso (verde #4E6709): Exportar PDF
  - Destrutivo (vermelho #C81E3A): Sair, Excluir
  - Rosa da marca (#E75A84): Barra de progresso
- **Animações** suaves
- **Diálogos modernos** (sem alerts do browser)
- **Atalhos de teclado**
- **Export PDF** (funcionalidade preparada)

## 🎨 Design System

### Cores Semânticas

#### Light Mode
- **Background**: `#f8f6f4` (foam) - Fundo principal suave
- **Surface**: `#ffffff` - Cards e elementos elevados
- **Text Primary**: `#2d1810` - Texto principal com bom contraste
- **Accent**: `#c07040` (cinnamon) - Cor de destaque da marca
- **Success**: `#16a34a` - Ações de sucesso
- **Error**: `#dc2626` - Ações destrutivas

#### Dark Mode (Otimizado)
- **Background**: `#1a1611` - Fundo escuro confortável (não extremo)
- **Surface**: `#252017` - Cards com contraste adequado
- **Text Primary**: `#e8dcc6` - Texto claro sem agressividade
- **Border**: `#4a3f2e` - Bordas visíveis e definidas
- **Accent**: `#c08030` (caramel) - Destaque vibrante no escuro

### Hierarquia de Botões
1. **Primário**: Salvar, Adicionar, Login, Registro
2. **Sucesso**: Exportar PDF, Concluir
3. **Destrutivo**: Sair, Excluir, Cancelar crítico
4. **Secundário**: Carregar, Limpar, Configurações

## 🏗️ Arquitetura

### Estrutura do Projeto
```
curriculo-inteligente/
├── backend/                    # API Node.js + TypeScript
│   ├── src/
│   │   ├── middleware/         # Middlewares (auth, cors, etc)
│   │   ├── routes/            # Rotas da API
│   │   ├── types/             # Interfaces TypeScript
│   │   ├── utils/             # Utilitários
│   │   └── index.ts           # Entry point do servidor
│   ├── .env.example           # Variáveis de ambiente exemplo
│   ├── package.json
│   └── tsconfig.json
├── curriculo-inteligente/      # Frontend React + TypeScript
│   ├── src/
│   │   ├── assets/            # Imagens e recursos
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── contexts/          # Context API (Auth)
│   │   ├── pages/             # Páginas principais
│   │   ├── services/          # APIs e integrações
│   │   ├── types/             # TypeScript interfaces
│   │   └── main.tsx           # Entry point
│   ├── .env.example           # Variáveis de ambiente exemplo
│   ├── package.json
│   └── vite.config.ts
└── .gitignore                  # Gitignore principal
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

### Por que CSS-in-JS com Variáveis CSS?

1. **Temas Dinâmicos**: Variáveis CSS permitem mudança de cores em tempo real
2. **Performance**: Sem CSS adicional para carregar, estilos inline otimizados
3. **Flexibilidade**: Animações e estados complexos com JavaScript
4. **Controle Total**: Cada componente tem controle completo sobre seu estilo
5. **Bundle Size**: Menor tamanho final da aplicação
6. **Responsividade**: Breakpoints gerenciados via JavaScript com useResponsive
7. **Manutenibilidade**: Variáveis CSS centralizadas para consistência

### Por que useRef ao invés de useState?

1. **Performance**: Evita re-renders desnecessários durante digitação
2. **UX**: Elimina delay na digitação e melhora responsividade
3. **Simplicidade**: Menos código para gerenciar estado de formulários
4. **Auto-save**: Permite salvamento automático sem interferir na UX
5. **Memória**: Menor uso de memória para campos de texto grandes

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

### 1. Clonar o Repositório
```bash
git clone <repository-url>
cd curriculo-inteligente
```

### 2. Configurar Backend
```bash
cd backend
npm install

# Configurar variáveis de ambiente
cp src/.env.example .env
# Editar .env com suas configurações:
# PORT=3001
# JWT_SECRET=seu_jwt_secret_aqui
```

### 3. Configurar Frontend
```bash
cd ../curriculo-inteligente
npm install

# Em caso de conflito de versões
npm install --legacy-peer-deps

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env:
# VITE_API_URL=http://localhost:3001/api
```

### 4. Executar em Desenvolvimento

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd curriculo-inteligente
npm run dev
```

### 5. Build para Produção
```bash
# Backend
cd backend
npm run build

# Frontend
cd ../curriculo-inteligente
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

## ✅ Melhorias Recentes Implementadas

### 🤖 **Integração com IA (Google Gemini)**
- **Melhoria de Texto**: IA para aprimorar resumo, objetivos e descrições de experiência
- **Sugestão de Habilidades**: IA analisa conteúdo do currículo e sugere skills relevantes
- **Prompts Especializados**: Diferentes prompts para cada tipo de conteúdo
- **Fallback Inteligente**: Sistema de fallback quando IA não está disponível
- **Loading States**: Feedback visual durante processamento da IA

### 📱 **Responsividade e UX Moderna**
- **Hook useResponsive**: Gerenciamento inteligente de breakpoints
- **Layout Adaptativo**: Grid responsivo com proporções otimizadas (1.2fr 0.8fr)
- **Preview Centralizado**: Template centralizado com transform-origin adequado
- **Mobile-First**: Layout otimizado para dispositivos móveis
- **Sticky Preview**: Preview fixo apenas em desktop, estático em mobile

### 🎨 **Design System Aprimorado**
- **Dark Mode Melhorado**: Cores ajustadas para melhor legibilidade e conforto visual
- **Textos Justificados**: Resumo, objetivos e experiências com alinhamento justificado
- **Templates Otimizados**: Escala reduzida (0.85 desktop, 0.75 mobile) para melhor visualização
- **Tipografia Refinada**: Tamanhos de fonte otimizados (H1: 24px, H2: 16px, texto: 13px)
- **Espaçamentos Compactos**: Margens e paddings reduzidos para melhor aproveitamento do espaço

### 🔧 **Correções Técnicas Críticas**
- **API Endpoints**: Corrigidos endpoints de salvar/carregar currículos
- **Autenticação**: Token `auth-token` consistente em toda aplicação
- **Estrutura de Dados**: Campo `education` padronizado entre frontend/backend
- **Formulário de Habilidades**: Layout grid otimizado e edição inline
- **Auto-expanding Textareas**: Campos de texto que se expandem automaticamente

### 🔒 **Segurança e Validação**
- **Middleware de Validação**: Validação completa no backend para auth e resumes
- **Dependências Atualizadas**: Express 4.20.0 com correções de segurança
- **Sanitização**: Helpers para sanitização de nomes de arquivos
- **CORS Configurado**: Configuração adequada para desenvolvimento e produção

### ⚡ **Performance e Otimização**
- **useMemo**: Otimização de re-renders com memoização de themes
- **IDs Únicos**: crypto.randomUUID() substituindo Date.now()
- **Templates Externos**: Arrays movidos para fora dos componentes
- **Helpers Reutilizáveis**: Funções utilitárias centralizadas
- **Will-change**: Propriedades CSS para melhor performance de animações
- **Reduced Motion**: Suporte para usuários com preferências de acessibilidade

### 🛠️ **Estrutura e Manutenibilidade**
- **Hooks Personalizados**: useResponsive para gerenciamento de breakpoints
- **Utils Helpers**: generateId, sanitizeFileName, formatDate, validateEmail
- **Componentes Reutilizáveis**: LoadingSpinner, Skeleton, ConfirmDialog
- **Código Limpo**: Redução de duplicação e melhor organização
- **TypeScript**: Tipagem completa e interfaces bem definidas

## 🎯 Próximos Passos

1. **Sanitização XSS**: Implementar DOMPurify para campos de texto
2. **CSRF Protection**: Tokens CSRF no backend
3. **Compartilhamento**: URLs públicas para currículos
4. **Templates Customizáveis**: Editor de templates drag-and-drop
5. **Analytics**: Métricas de visualização e uso
6. **IA Avançada**: 
   - Análise de vagas para otimização de currículos
   - Geração automática de cartas de apresentação
   - Sugestões de melhoria baseadas em tendências do mercado
7. **Exportação Avançada**: 
   - Múltiplos formatos (Word, LinkedIn, etc.)
   - Templates para diferentes países/culturas
8. **Colaboração**: Compartilhamento para revisão e feedback
9. **Integração APIs**: LinkedIn, Indeed, outras plataformas de emprego
10. **PWA**: Aplicação web progressiva para uso offline

## 📝 Notas de Desenvolvimento

### **Funcionalidades Principais**
- **Auto-save**: Salva automaticamente a cada mudança no localStorage
- **IA Integrada**: Google Gemini para melhoria de texto e sugestões
- **Validação Completa**: Frontend + backend com feedback visual
- **Responsividade Total**: Breakpoints: mobile (<768px), tablet (768-1199px), desktop (≥1200px)
- **Dark/Light Mode**: Transição suave com cores otimizadas
- **Export PDF**: Geração com html2canvas + jsPDF

### **Arquitetura Técnica**
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + SQLite + JWT
- **Estado**: Context API + useRef para performance
- **Estilização**: CSS-in-JS com variáveis CSS customizadas
- **Hooks**: useResponsive, useAuth personalizados
- **Performance**: useMemo, will-change, lazy loading

### **Qualidade e Manutenibilidade**
- **TypeScript**: Tipagem completa em todo projeto
- **Componentes**: Reutilizáveis e bem documentados
- **Helpers**: Funções utilitárias centralizadas
- **Tratamento de Erros**: Try-catch consistente com toast feedback
- **Acessibilidade**: ARIA labels, navegação por teclado, reduced motion
- **Segurança**: Variáveis de ambiente, middleware de validação, sanitização

### **UX/UI Moderna**
- **Loading States**: Spinners, skeletons, feedback visual completo
- **Animações**: Micro-interações suaves com cubic-bezier
- **Feedback**: Toast notifications, confirmações, estados de erro
- **Responsividade**: Layout adaptativo com grid CSS
- **Tipografia**: Inter font, hierarquia clara, textos justificados

## 📅 Changelog

### v1.4.0 - Integração IA e UX Moderna (Atual)
- ✅ **Integração Google Gemini**: Melhoria de texto e sugestão de habilidades com IA
- ✅ **Responsividade Completa**: Hook useResponsive e layout adaptativo
- ✅ **Dark Mode Aprimorado**: Cores ajustadas para melhor legibilidade
- ✅ **Templates Otimizados**: Escala e tipografia refinadas
- ✅ **Correções Críticas**: API endpoints e autenticação corrigidos
- ✅ **Auto-expanding Textareas**: Campos que se expandem automaticamente
- ✅ **Skeleton Loading**: Estados de carregamento com animações
- ✅ **Textos Justificados**: Melhor legibilidade no preview
- ✅ **Formulários Aprimorados**: Layout grid e validação melhorada

### v1.3.0 - Estados de Loading e Animações
- ✅ **Loading States Completos**: Spinners e feedback visual em todas operações
- ✅ **Skeleton Screens**: Carregamento com placeholders animados
- ✅ **Animações Suaves**: Transições e micro-interações aprimoradas
- ✅ **Toast Notifications**: Sistema de notificações moderno
- ✅ **Tratamento de Erros**: Try-catch consistente com feedback visual

### v1.2.0 - Melhorias de Segurança e Performance
- ✅ Middleware de validação no backend
- ✅ Dependências atualizadas (Express 4.20.0)
- ✅ Otimizações de performance com memoização
- ✅ IDs únicos com crypto.randomUUID()
- ✅ Helpers reutilizáveis
- ✅ Interface Resume completa

### v1.1.0 - PDF Export Funcional
- ✅ Geração de PDF com html2canvas + jsPDF
- ✅ Correção de cores CSS (oklab removido)
- ✅ Templates de currículo funcionais

### v1.0.0 - Lançamento Inicial
- ✅ Sistema de autenticação completo
- ✅ Formulários de currículo com 6 etapas
- ✅ 6 templates profissionais
- ✅ Dark/Light mode
- ✅ Auto-save e persistência local

## 🔒 Segurança

- **Arquivos `.env` não versionados** (protegidos pelo .gitignore)
- **Tokens JWT** para autenticação segura
- **Validação de dados** no frontend e backend
- **CORS configurado** adequadamente
- **Middleware de autenticação** no backend
- **Histórico limpo** - arquivos sensíveis removidos do git

## 📁 Arquivos Importantes

### Configuração
- `.env.example` - Template de variáveis de ambiente
- `.gitignore` - Proteção de arquivos sensíveis
- `tsconfig.json` - Configuração TypeScript
- `vite.config.ts` - Configuração do Vite

### Desenvolvimento
- `package.json` - Dependências e scripts
- `nodemon.json` - Configuração do nodemon (backend)
- `.prettierrc` - Formatação de código

---

## 🏆 Destaques Técnicos

### **Inovações Implementadas**
- **IA Generativa**: Primeira aplicação de currículo com Google Gemini integrado
- **Responsividade Inteligente**: Hook personalizado para gerenciamento de breakpoints
- **Dark Mode Científico**: Cores ajustadas baseadas em princípios de legibilidade
- **Performance Otimizada**: Will-change, memoização e lazy loading
- **UX Moderna**: Skeleton loading, micro-interações e feedback visual completo

### **Qualidade de Código**
- **100% TypeScript**: Tipagem completa e interfaces bem definidas
- **Componentes Reutilizáveis**: Arquitetura modular e escalável
- **Hooks Personalizados**: Lógica encapsulada e reutilizável
- **Tratamento de Erros**: Robusto e com feedback visual
- **Documentação Completa**: README detalhado e código autodocumentado

---

**Desenvolvido com foco em IA, UX moderna, performance otimizada e arquitetura escalável.**