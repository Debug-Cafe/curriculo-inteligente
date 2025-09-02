import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface PDFOptions {
  filename?: string;
  quality?: number;
  scale?: number;
}

export const generatePDF = async (
  element: HTMLElement,
  options: PDFOptions = {}
): Promise<void> => {
  const {
    filename = 'curriculo',
    quality = 1.0,
    scale = 2
  } = options;

  // Configurações otimizadas para html2canvas
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    width: element.scrollWidth,
    height: element.scrollHeight,
    scrollX: 0,
    scrollY: 0,
    removeContainer: true,
    imageTimeout: 15000,
    logging: false
  });

  const imgData = canvas.toDataURL('image/png', quality);
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;
  
  let heightLeft = imgHeight;
  let position = 0;

  // Primeira página
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  // Páginas adicionais se necessário
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  // Salvar o PDF
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9]/g, '_');
  pdf.save(`${sanitizedFilename}_curriculo.pdf`);
};