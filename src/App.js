import React, { useState, useRef } from 'react';
import Card from './Card';
import './App.css';
import PhotoCropper from './components/PhotoCropper.jsx';
import { normalizeImage } from './utils/image.js';

function App() {
  const [cards, setCards] = useState([
    { id: 1, image: null, name: '', title: '', previewUrl: null, croppedUrl: null },
    { id: 2, image: null, name: '', title: '', previewUrl: null, croppedUrl: null },
    { id: 3, image: null, name: '', title: '', previewUrl: null, croppedUrl: null },
    { id: 4, image: null, name: '', title: '', previewUrl: null, croppedUrl: null }
  ]);
  const exportRef = useRef();
  const [cropperForCardId, setCropperForCardId] = useState(null);
  const [pendingImageUrl, setPendingImageUrl] = useState(null);

  const handleImageUpload = async (id, file) => {
    if (!file) return;
    const { dataUrl, tooSmall } = await normalizeImage(file, { maxDimension: 2000, minDimension: 300 });
    if (tooSmall) {
      alert('The selected image is too small and may look blurry. Please use a higher-resolution image.');
    }
    setCards(prev => prev.map(card =>
      card.id === id
        ? { ...card, image: file, previewUrl: dataUrl, croppedUrl: null }
        : card
    ));
    setPendingImageUrl(dataUrl);
    setCropperForCardId(id);
  };

  const handleCropCancel = () => {
    setCropperForCardId(null);
    setPendingImageUrl(null);
  };

  const handleCropSave = ({ croppedDataUrl }) => {
    if (!cropperForCardId) return;
    setCards(prev => prev.map(card =>
      card.id === cropperForCardId ? { ...card, croppedUrl: croppedDataUrl } : card
    ));
    setCropperForCardId(null);
    setPendingImageUrl(null);
  };

  const handleNameChange = (id, name) => {
    setCards(prev => prev.map(card =>
      card.id === id ? { ...card, name } : card
    ));
  };

  const handleTitleChange = (id, title) => {
    setCards(prev => prev.map(card =>
      card.id === id ? { ...card, title } : card
    ));
  };

  const generatePDF = async () => {
    try {
      const html2canvas = await import('html2canvas');
      const { jsPDF } = await import('jspdf');
      const exportNode = exportRef.current;
      // Lower scale for faster rendering while keeping acceptable quality
      const scale = 2; // was 4
      const canvas = await html2canvas.default(exportNode, {
        scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#fff',
        width: exportNode.offsetWidth,
        height: exportNode.offsetHeight,
        imageTimeout: 0,
        logging: false,
        removeContainer: true
      });

      // Use JPEG for smaller file size and faster addImage
      const imgData = canvas.toDataURL('image/jpeg', 0.85);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      // Preserve aspect ratio when placing the image on the page
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Canvas size in pixels; convert to mm using jsPDF's ratio via width fit
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth; // try to fit width first
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      let renderWidth = imgWidth;
      let renderHeight = imgHeight;
      if (imgHeight > pageHeight) {
        // If height overflows, fit by height instead
        renderHeight = pageHeight;
        renderWidth = (imgProps.width * renderHeight) / imgProps.height;
      }

      const offsetX = (pageWidth - renderWidth) / 2;
      const offsetY = (pageHeight - renderHeight) / 2;

      pdf.addImage(imgData, 'JPEG', offsetX, offsetY, renderWidth, renderHeight, undefined, 'FAST');
      pdf.save('birthday-cards.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎂 Birthday Card Generator</h1>      
      </header>

      <main className="app-main">
        <div className="input-section">
          <h2>Create Your Cards</h2>
          <div className="cards-input">
            {cards.map((card) => (
              <div key={card.id} className="card-input">
                <h3>Card {card.id}</h3>
                <div className="upload-area">
                  <label htmlFor={`image-${card.id}`} className="upload-label">
                    {card.image ? (
                      <img src={card.croppedUrl || card.previewUrl} alt="Preview" className="image-preview" />
                    ) : (
                      <div className="upload-placeholder">
                        <span>📷</span>
                        <p>Click to upload photo</p>
                      </div>
                    )}
                  </label>
                  <input
                    id={`image-${card.id}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(card.id, e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                  {card.image && (
                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                      <button className="btn btn-secondary" onClick={() => { setPendingImageUrl(card.previewUrl); setCropperForCardId(card.id); }}>Adjust Photo</button>
                      {card.croppedUrl && (
                        <button className="btn" onClick={() => setCards(prev => prev.map(c => c.id === card.id ? { ...c, croppedUrl: null } : c))}>Reset</button>
                      )}
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={card.name}
                  onChange={(e) => handleNameChange(card.id, e.target.value)}
                  className="name-input"
                />
                <input
                  type="text"
                  placeholder="Enter designation (e.g., B.Sc.(IT))"
                  value={card.title}
                  onChange={(e) => handleTitleChange(card.id, e.target.value)}
                  className="name-input"
                  style={{ marginTop: '10px' }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="preview-section">
          <h2>Preview Cards</h2>
          <div className="cards-preview">
            {cards.map((card) => (
              <Card
                key={card.id}
                image={card.image}
                name={card.name}
                title={card.title}
                previewUrl={card.croppedUrl || card.previewUrl}
              />
            ))}
          </div>
        </div>

        <div className="export-section">
          <button
            onClick={generatePDF}
            className={`export-btn active`}
          >
            📄 Download PDF
          </button>
        </div>

        {/* Hidden export container for PDF generation */}
        <div
          ref={exportRef}
          className="export-page"
          style={{
            position: 'absolute',
            left: '-9999px',
            top: 0
          }}
        >
          <div className="cards-preview">
            {cards.map((card) => (
              card.image && card.name ? (
                <Card
                  key={card.id}
                  image={card.image}
                  name={card.name}
                  title={card.title}
                  previewUrl={card.croppedUrl || card.previewUrl}
                />
              ) : null
            ))}
          </div>
        </div>

      </main>

      {/* Footer Section */}
      <footer className="birthday-footer">
        <div className="footer-container">
          {/* Developed By Section */}
          <div className="developed-section">
            <h2>Developed By :</h2>
            <table className="developer-table">
              <thead>
                <tr>
                  <th>Enrollment No.</th>
                  <th>Name</th>
                  <th>Course</th>
                  <th>Semester</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>230801313</td>
                  <td>Chand Kavar</td>
                  <td>B.C.A.</td>
                  <td>Sem - 5</td>
                </tr>
                <tr>
                  <td>240802125</td>
                  <td>Sezan Patani</td>
                  <td>B.Sc.I.T.</td>
                  <td>Sem - 3</td>
                </tr>
                <tr>
                  <td>230801240</td>
                  <td>Raj Jadav</td>
                  <td>B.C.A.</td>
                  <td>Sem - 5</td>
                </tr>
                <tr>
                  <td>230801347</td>
                  <td>Keval Lathiya</td>
                  <td>B.C.A.</td>
                  <td>Sem - 5</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Managed By Section */}
          <div className="managed-section">
            <h2>Managed By :</h2>
            <p className="department-info">Department of Computer Science</p>
            <p className="department-info">Faculty of Science</p>
            <p className="department-info"> Atmiya University</p>
          </div>
        </div>
      </footer>

      {cropperForCardId && pendingImageUrl && (
        <PhotoCropper
          imageUrl={pendingImageUrl}
          aspect={3/4}
          onCancel={handleCropCancel}
          onSave={handleCropSave}
        />
      )}
    </div>
  );
}

export default App;
