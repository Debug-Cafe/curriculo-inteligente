import { useState, useCallback, useEffect, useRef } from 'react';
import type { Resume, PersonalData, Skill, Experience } from '../types';
import PersonalDataForm from '../components/PersonalDataForm';
import SkillsForm from '../components/SkillsForm';
import ExperienceForm from '../components/ExperienceForm';
import EducationForm from '../components/EducationForm';
import ObjectivesForm from '../components/ObjectivesForm';
import ResumePreview from '../components/ResumePreview';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadDialog from '../components/LoadDialog';
import TemplateSelector from '../components/TemplateSelector';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Home() {
  const { user, logout } = useAuth();
  const [resume, setResume] = useState<Resume>({
    personalData: { name: '', email: '', phone: '', linkedin: '', summary: '' },
    skills: [],
    experiences: []
  });
  const [educations, setEducations] = useState<any[]>([]);
  const [objective, setObjective] = useState('');
  const [clearDialog, setClearDialog] = useState(false);
  const [loadDialog, setLoadDialog] = useState<{ isOpen: boolean; resumes: any[] }>({ isOpen: false, resumes: [] });
  const [template, setTemplate] = useState('modern');
  const [darkMode, setDarkMode] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const getProgressStep = () => {
    let step = 0;
    if (resume.personalData.name) step = 1;
    if (resume.experiences.length > 0) step = 2;
    if (educations.length > 0) step = 3;
    if (resume.skills.length > 0) step = 4;
    if (objective) step = 5;
    if (resume.personalData.name && resume.experiences.length > 0 && educations.length > 0 && resume.skills.length > 0 && objective) step = 6;
    return step;
  };

  const updatePersonalData = useCallback((personalData: PersonalData) => {
    setResume(prev => ({ ...prev, personalData }));
  }, []);

  const updateSkills = useCallback((skills: Skill[]) => {
    setResume(prev => ({ ...prev, skills }));
  }, []);

  const updateExperiences = useCallback((experiences: Experience[]) => {
    setResume(prev => ({ ...prev, experiences }));
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('resume-draft', JSON.stringify(resume));
    }, 1000);
    return () => clearTimeout(timer);
  }, [resume]);

  // Load from localStorage on mount
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

  // Keyboard shortcuts
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
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [resume]);

  const handleSave = async () => {
    if (!resume.personalData.name.trim()) return;
    try {
      const resumeWithUser = { ...resume, userId: user?.id };
      const savedResume = await api.saveResume(resumeWithUser);
      setResume(savedResume);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoad = async () => {
    try {
      const resumesList = await api.getUserResumes(user?.id || '');
      setLoadDialog({ isOpen: true, resumes: resumesList });
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmLoad = async (id: string) => {
    try {
      const loadedResume = await api.getResume(id);
      setResume(loadedResume);
      setLoadDialog({ isOpen: false, resumes: [] });
    } catch (error) {
      console.error(error);
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
      personalData: { name: '', email: '', phone: '', linkedin: '', summary: '' },
      skills: [],
      experiences: []
    });
    setEducations([]);
    setObjective('');
    setClearDialog(false);
  };

  const handleCancelClear = () => {
    setClearDialog(false);
  };

  const handleExportPDF = async () => {
    if (!previewRef.current) return;
    
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const fileName = resume.personalData.name || 'resume';
      pdf.save(`${fileName.replace(/\s+/g, '_')}_resume.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const theme = {
    bg: darkMode ? '#0f172a' : '#f8fafc',
    cardBg: darkMode ? '#1e293b' : 'white',
    text: darkMode ? '#f1f5f9' : '#1e293b',
    border: darkMode ? '#475569' : '#e2e8f0',
    headerBg: darkMode ? '#1e293b' : 'white',
    inputBg: darkMode ? '#334155' : 'white'
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: theme.bg,
      fontFamily: 'Inter, sans-serif',
      transition: 'background-color 0.3s ease'
    }}>
      {/* Header */}
      <div style={{
        background: theme.headerBg,
        borderBottom: `1px solid ${theme.border}`,
        padding: '16px 0',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: theme.text
            }}>
              Construtor de Currículo
            </h1>
            <p style={{
              fontSize: '14px',
              color: theme.text,
              opacity: 0.7,
              marginTop: '4px'
            }}>
              Bem-vindo, {user?.name}!
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={handleSave}
              style={{
                padding: '8px 16px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Salvar
            </button>
            <button 
              onClick={handleLoad}
              style={{
                padding: '8px 16px',
                background: '#f1f5f9',
                color: '#475569',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Carregar
            </button>
            <button 
              onClick={handleClear}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                color: '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Limpar
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                padding: '8px 12px',
                background: 'transparent',
                border: `1px solid ${theme.border}`,
                borderRadius: '6px',
                color: theme.text,
                cursor: 'pointer',
                fontSize: '16px'
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
              style={{
                padding: '8px 16px',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Exportar PDF
            </button>
            <button 
              onClick={logout}
              style={{
                padding: '8px 16px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '32px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '32px'
      }}>
        {/* Forms */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <PersonalDataForm data={resume.personalData} onChange={updatePersonalData} theme={theme} />
          <ExperienceForm experiences={resume.experiences} onChange={updateExperiences} theme={theme} />
          <EducationForm educations={educations} onChange={setEducations} theme={theme} />
          <SkillsForm skills={resume.skills} onChange={updateSkills} theme={theme} />
          <ObjectivesForm objective={objective} onChange={setObjective} theme={theme} />
        </div>

        {/* Preview */}
        <div style={{ position: 'sticky', top: '32px', height: 'fit-content' }}>
          <div ref={previewRef}>
            <ResumePreview resume={resume} template={template} theme={theme} />
          </div>
        </div>
      </div>


      

      
      {/* Fixed Progress Bar */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: '8px',
        padding: '16px 24px',
        maxWidth: '800px',
        width: '90%',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        zIndex: 100
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px'
        }}>
          {[
            'Cabeçalho do currículo',
            'Histórico profissional', 
            'Formação acadêmica',
            'Competências',
            'Objetivo',
            'Finalizar'
          ].map((step, index) => (
            <div key={step} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flex: '1'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                minWidth: '24px',
                minHeight: '24px',
                borderRadius: '50%',
                background: index < getProgressStep() ? '#3b82f6' : theme.border,
                color: index < getProgressStep() ? 'white' : theme.text,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '500',
                flexShrink: 0
              }}>
                {index + 1}
              </div>
              <span style={{
                fontSize: '12px',
                color: index < getProgressStep() ? '#3b82f6' : theme.text,
                fontWeight: index < getProgressStep() ? '500' : '400'
              }}>
                {step}
              </span>
              {index < 5 && (
                <div style={{
                  flex: '1',
                  height: '2px',
                  background: theme.border,
                  marginLeft: '8px'
                }} />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Spacer for fixed progress bar */}
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
    </div>
  );
}