import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import type { Resume, PersonalData, Skill, Experience, Education } from '../types';
import PersonalDataForm from '../components/PersonalDataForm';
import SkillsForm from '../components/SkillsForm';
import ExperienceForm from '../components/ExperienceForm';
import EducationForm from '../components/EducationForm';
import ObjectivesForm from '../components/ObjectivesForm';
import ResumePreview from '../components/ResumePreview';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadDialog from '../components/LoadDialog';
import TemplateSelector from '../components/TemplateSelector';
import Toast from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import logo from '../assets/logo.png';

export default function Home() {
  const { user, logout } = useAuth();
  const [resume, setResume] = useState<Resume>({
    personalData: { name: '', email: '', phone: '', linkedin: '', summary: '' },
    skills: [],
    experiences: [],
    education: [],
    objectives: '',
  });
  const [darkMode, setDarkMode] = useState(false);
  const [clearDialog, setClearDialog] = useState(false);
  const [loadDialog, setLoadDialog] = useState<{
    isOpen: boolean;
    resumes: any[];
  }>({ isOpen: false, resumes: [] });
  const [template, setTemplate] = useState<'modern' | 'classic' | 'creative' | 'minimal' | 'professional' | 'elegant'>('modern');
  const [toast, setToast] = useState({ message: '', type: 'success' as 'success' | 'error', isVisible: false });
  const [isLoading, setIsLoading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const getProgressStep = () => {
    let step = 0;
    if (resume.personalData.name) step = 1;
    if (resume.experiences.length > 0) step = 2;
    if (resume.education.length > 0) step = 3;
    if (resume.skills.length > 0) step = 4;
    if (resume.objectives) step = 5;
    if (
      resume.personalData.name &&
      resume.experiences.length > 0 &&
      resume.education.length > 0 &&
      resume.skills.length > 0 &&
      resume.objectives
    )
      step = 6;
    return step;
  };

  const updatePersonalData = useCallback((personalData: PersonalData) => {
    setResume((prev) => ({ ...prev, personalData }));
  }, []);

  const updateSkills = useCallback((skills: Skill[]) => {
    setResume((prev) => ({ ...prev, skills }));
  }, []);

  const updateExperiences = useCallback((experiences: Experience[]) => {
    setResume((prev) => ({ ...prev, experiences }));
  }, []);

  const updateEducation = useCallback((education: Education[]) => {
    setResume((prev) => ({ ...prev, education }));
  }, []);

  const updateObjective = useCallback((objective: string) => {
    setResume((prev) => ({ ...prev, objectives: objective }));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('resume-draft', JSON.stringify(resume));
    }, 1000);
    return () => clearTimeout(timer);
  }, [resume]);

  useEffect(() => {
    const saved = localStorage.getItem('resume-draft');
    if (saved) {
      try {
        setResume(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved resume');
      }
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'l':
            e.preventDefault();
            handleLoad();
            break;
          case 'p':
            e.preventDefault();
            handleExportPDF();
            break;
          case 'n':
            e.preventDefault();
            handleClear();
            break;
          case 'e':
            e.preventDefault();
            handleExportPDF();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [resume]);

  const handleSave = async () => {
    if (!resume.personalData.name.trim()) return;
    setIsLoading(true);
    try {
      const resumeWithUser = { ...resume, userId: user?.id };
      const savedResume = await api.saveResume(resumeWithUser);
      setResume(savedResume);
      setToast({ message: 'Seu currículo foi salvo com sucesso!', type: 'success', isVisible: true });
    } catch (error) {
      console.error(error);
      setToast({ message: 'Erro ao salvar currículo. Tente novamente.', type: 'error', isVisible: true });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = async () => {
    try {
      const resumesList = await api.getUserResumes(user?.id || '');
      setLoadDialog({ isOpen: true, resumes: resumesList });
    } catch (error) {
      console.error(error);
      setToast({ message: 'Erro ao carregar currículos', type: 'error', isVisible: true });
    }
  };

  const handleConfirmLoad = async (id: string) => {
    try {
      const loadedResume = await api.getResume(id);
      setResume(loadedResume);
      setLoadDialog({ isOpen: false, resumes: [] });
      setToast({ message: 'Currículo carregado com sucesso!', type: 'success', isVisible: true });
    } catch (error) {
      console.error(error);
      setToast({ message: 'Erro ao carregar currículo', type: 'error', isVisible: true });
    }
  };

  const handleCancelLoad = () => {
    setLoadDialog({ isOpen: false, resumes: [] });
  };

  const handleClear = () => {
    setClearDialog(true);
  };

  const handleConfirmClear = () => {
    setResume({
      personalData: {
        name: '',
        email: '',
        phone: '',
        linkedin: '',
        summary: '',
      },
      skills: [],
      experiences: [],
      education: [],
      objectives: '',
    });
    setClearDialog(false);
  };

  const handleCancelClear = () => {
    setClearDialog(false);
  };

  const handleExportPDF = () => {
    const element = document.getElementById('resume-content');
    if (!element) return;

    html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    }).then(canvas => {
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      const fileName = resume.personalData.name || 'curriculo';
      pdf.save(`${fileName.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
      
      setToast({ message: 'PDF gerado com sucesso!', type: 'success', isVisible: true });
    }).catch(() => {
      setToast({ message: 'Erro ao gerar PDF', type: 'error', isVisible: true });
    });
  };

  const theme = useMemo(() => ({
    bg: 'var(--bg)',
    cardBg: 'var(--surface)',
    text: 'var(--text-primary)',
    border: 'var(--border)',
    headerBg: darkMode ? 'linear-gradient(135deg, #2d1b14 0%, #1a0f0a 100%)' : 'linear-gradient(135deg, #603010 0%, #4a2a1c 100%)',
    inputBg: 'var(--surface)',
  }), [darkMode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.bg,
        fontFamily: 'Inter, sans-serif',
        transition: 'background-color 0.3s ease',
      }}
    >
      <main role="main">
      <header
        role="banner"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 2000,
          background: theme.headerBg,
          borderBottom: `1px solid ${theme.border}`,
          padding: '20px 0',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 20px rgba(96, 48, 16, 0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img
              src={logo}
              alt="Logo"
              style={{
                height: '45px',
                width: 'auto',
                opacity: 0.9,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
              }}
            />
            <div>
              <h1
                style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: 'var(--foam)',
                  marginBottom: '6px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  letterSpacing: '-0.5px',
                }}
              >
                Criador de Currículos Profissionais
              </h1>
              <p
                style={{
                  fontSize: '14px',
                  color: 'var(--foam)',
                  opacity: 0.8,
                }}
              >
                Olá, {user?.name}! Crie seu currículo perfeito em minutos
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="btn-primary"
              aria-label="Salvar currículo (Ctrl+S)"
              title="Salvar currículo (Ctrl+S)"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {isLoading && <LoadingSpinner size={16} color="white" />}
              Salvar
            </button>
            <button
              onClick={handleLoad}
              className="btn-primary"
              aria-label="Carregar currículo (Ctrl+L)"
              title="Carregar currículo (Ctrl+L)"
            >
              Carregar
            </button>
            <button
              onClick={handleClear}
              className="btn-primary"
              aria-label="Limpar formulário (Ctrl+N)"
              title="Limpar formulário (Ctrl+N)"
            >
              Limpar
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              aria-label={`Alternar para modo ${darkMode ? 'claro' : 'escuro'}`}
              title={`Alternar para modo ${darkMode ? 'claro' : 'escuro'}`}
              style={{
                padding: '8px 12px',
                background: 'transparent',
                border: '1px solid rgba(248, 246, 244, 0.3)',
                borderRadius: '6px',
                color: 'var(--foam)',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <TemplateSelector
              template={template}
              onChange={setTemplate}
              theme={theme}
            />
            <button
              onClick={handleExportPDF}
              className="btn-secondary"
              aria-label="Exportar currículo em PDF (Ctrl+P)"
              title="Exportar currículo em PDF (Ctrl+P)"
            >
              Exportar PDF
            </button>
            <button
              onClick={logout}
              className="btn-danger"
              aria-label="Sair da aplicação"
              title="Sair da aplicação"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div
        className="desktop-grid desktop-padding"
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '40px 32px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          minHeight: 'calc(100vh - 200px)',
        }}
      >
        <section 
          aria-label="Formulários de dados" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '32px',
            padding: '8px'
          }}
        >
          <PersonalDataForm
            data={resume.personalData}
            onChange={updatePersonalData}
            theme={theme}
          />
          <ExperienceForm
            experiences={resume.experiences}
            onChange={updateExperiences}
            theme={theme}
          />
          <EducationForm
            educations={resume.education}
            onChange={updateEducation}
            theme={theme}
          />
          <SkillsForm
            skills={resume.skills}
            onChange={updateSkills}
            theme={theme}
          />
          <ObjectivesForm
            objective={resume.objectives}
            onChange={updateObjective}
            theme={theme}
          />
        </section>

        <aside 
          role="complementary" 
          aria-label="Visualização do currículo"
          style={{ 
            position: window.innerWidth < 1024 ? 'static' : 'sticky', 
            top: '32px', 
            zIndex: 10,
            height: 'fit-content'
          }}
        >
          <div ref={previewRef}>
            <ResumePreview resume={resume} template={template} theme={theme} />
          </div>
        </aside>
      </div>

      <nav
        role="navigation"
        aria-label="Progresso do currículo"
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: `${theme.cardBg}f0`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${theme.border}`,
          borderRadius: '16px',
          padding: '20px 32px',
          maxWidth: '900px',
          width: '95%',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 50,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {[
            'Cabeçalho do currículo',
            'Histórico profissional',
            'Formação acadêmica',
            'Competências',
            'Objetivo',
            'Finalizar',
          ].map((step, index) => (
            <div
              key={step}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flex: '1',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  minWidth: '32px',
                  minHeight: '32px',
                  borderRadius: '50%',
                  background:
                    index < getProgressStep()
                      ? 'linear-gradient(135deg, var(--cinnamon), var(--caramel))'
                      : theme.border,
                  color: index < getProgressStep() ? 'white' : theme.text,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  flexShrink: 0,
                  boxShadow: index < getProgressStep() ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                {index + 1}
              </div>
              <span
                style={{
                  fontSize: '13px',
                  color: index < getProgressStep() ? 'var(--cinnamon)' : theme.text,
                  fontWeight: index < getProgressStep() ? '600' : '500',
                  transition: 'all 0.3s ease',
                }}
              >
                {step}
              </span>
              {index < 5 && (
                <div
                  style={{
                    flex: '1',
                    height: '2px',
                    background: theme.border,
                    marginLeft: '8px',
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </nav>

      <div style={{ height: '120px' }} />

      <ConfirmDialog
        isOpen={clearDialog}
        title="Limpar Currículo"
        message="Tem certeza que deseja limpar todos os dados do currículo? Todas as informações serão perdidas e esta ação não pode ser desfeita."
        onConfirm={handleConfirmClear}
        onCancel={handleCancelClear}
        theme={theme}
      />

      <LoadDialog
        isOpen={loadDialog.isOpen}
        resumes={loadDialog.resumes}
        onLoad={handleConfirmLoad}
        onCancel={handleCancelLoad}
        theme={theme}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />
      </main>
    </div>
  );
}