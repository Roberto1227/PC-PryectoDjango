document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('name-input');
  const generateBtn = document.getElementById('generate-btn');
  const downloadBtn = document.getElementById('download-btn');
  const printBtn = document.getElementById('print-btn');
  const editNameBtn = document.getElementById('edit-name-btn');
  const nameInputSection = document.getElementById('name-input-section');
  const diplomaActions = document.getElementById('diploma-actions');
  const studentNameEl = document.getElementById('student-name');
  const diplomaDateEl = document.getElementById('diploma-date');
  const diplomaImage = document.getElementById('diploma-image');
  
  // Esperar a que la imagen se cargue para calcular posiciones
  let imageLoaded = false;
  
  diplomaImage.addEventListener('load', () => {
    imageLoaded = true;
    adjustTextPositions();
  });
  
  // Si la imagen ya está cargada
  if (diplomaImage.complete) {
    imageLoaded = true;
    adjustTextPositions();
  }
  
  function adjustTextPositions() {
    if (!imageLoaded) return;
    
    // Las posiciones se manejan con CSS usando porcentajes
    // Esto asegura que se ajusten automáticamente al tamaño de la imagen
  }
  
  window.addEventListener('resize', () => {
    if (imageLoaded) {
      adjustTextPositions();
    }
  });
  
  // Establecer fecha automáticamente
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  diplomaDateEl.textContent = `San Miguel (${day}/${month}/${year})`;
  
  // Generar diploma
  generateBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (name === '') {
      alert('Por favor, ingresa tu nombre');
      nameInput.focus();
      return;
    }
    
    studentNameEl.textContent = name;
    nameInputSection.classList.add('hidden');
    diplomaActions.classList.remove('hidden');
    
    // Ajustar posiciones después de mostrar el nombre
    setTimeout(adjustTextPositions, 100);
    
    // Scroll suave al diploma
    document.querySelector('.diploma-container').scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  });
  
  // Editar nombre
  editNameBtn.addEventListener('click', () => {
    nameInputSection.classList.remove('hidden');
    diplomaActions.classList.add('hidden');
    nameInput.value = studentNameEl.textContent;
    nameInput.focus();
  });
  
  // Imprimir diploma
  printBtn.addEventListener('click', () => {
    window.print();
  });
  
  // Descargar diploma
  downloadBtn.addEventListener('click', async () => {
    const diplomaContainer = document.querySelector('.diploma-container');
    
    try {
      // Ocultar botones y sección de input antes de capturar
      diplomaActions.classList.add('hidden');
      nameInputSection.classList.add('hidden');
      
      // Esperar un momento para que se oculte todo
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Usar html2canvas para capturar el diploma
      const canvas = await html2canvas(diplomaContainer, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: diplomaContainer.offsetWidth,
        height: diplomaContainer.offsetHeight
      });
      
      // Obtener dimensiones del canvas en píxeles
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Convertir píxeles a mm (asumiendo 96 DPI: 1 pulgada = 25.4mm, 96px = 25.4mm)
      const mmPerPixel = 25.4 / 96;
      const pdfWidth = imgWidth * mmPerPixel;
      const pdfHeight = imgHeight * mmPerPixel;
      
      // Crear PDF usando jsPDF con dimensiones personalizadas
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? 'landscape' : 'portrait',
        unit: 'mm',
        format: [pdfWidth, pdfHeight]
      });
      
      // Convertir canvas a imagen y agregar al PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Generar nombre del archivo
      const nameForFile = studentNameEl.textContent.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, '_');
      
      // Descargar el PDF
      pdf.save(`Diploma_EduRetoSV_${nameForFile}.pdf`);
      
      // Mostrar botones de nuevo
      diplomaActions.classList.remove('hidden');
      
    } catch (error) {
      console.error('Error al generar el diploma:', error);
      alert('Hubo un error al generar el diploma. Por favor, intenta de nuevo.');
      diplomaActions.classList.remove('hidden');
    }
  });
  
  // Permitir Enter para generar
  nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      generateBtn.click();
    }
  });
});

