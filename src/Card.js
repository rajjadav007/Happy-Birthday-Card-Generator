import React from 'react';
import { Rnd } from 'react-rnd';

function Card({ card, templateBackground, onElementUpdate, onCardSelect, isSelected, onElementSelect, selectedElement, isInteractive = false }) {
  const { image, name, title, previewUrl, croppedUrl, photoPosition, photoSize, namePosition, titlePosition, nameStyle, titleStyle, id } = card;
  
  // All hooks must be at the top before any conditional returns
  const [isDragging, setIsDragging] = React.useState(null);
  const cardRef = React.useRef(null);
  const [cardDimensions, setCardDimensions] = React.useState({ width: 300, height: 400 });

  React.useEffect(() => {
    if (cardRef.current) {
      const updateDimensions = () => {
        setCardDimensions({
          width: cardRef.current.offsetWidth,
          height: cardRef.current.offsetHeight
        });
      };
      updateDimensions();
      
      // Update on window resize
      window.addEventListener('resize', updateDimensions);
      return () => window.removeEventListener('resize', updateDimensions);
    }
  }, []);
  
  // Early return after all hooks
  if (!image || !name) {
    return (
      <div className="card-placeholder">
        <div className="placeholder-content">
          <span>🎂</span>
          <p>Complete the form above to see preview</p>
        </div>
      </div>
    );
  }

  const handleDragStart = (elementType) => {
    setIsDragging(elementType);
  };

  const handleDragStop = (elementType, e, d) => {
    if (!isInteractive || !onElementUpdate) {
      setIsDragging(null);
      return;
    }
    
    // Get the card element to calculate percentages
    const cardElement = document.getElementById(`card-${id}`);
    if (!cardElement) {
      console.error('Card element not found');
      setIsDragging(null);
      return;
    }
    
    const cardRect = cardElement.getBoundingClientRect();
    
    // Get the element dimensions
    const elementWidth = d.node ? d.node.offsetWidth : 0;
    const elementHeight = d.node ? d.node.offsetHeight : 0;
    
    // Calculate center position in percentages
    const centerX = d.x + (elementWidth / 2);
    const centerY = d.y + (elementHeight / 2);
    
    const xPercent = ((centerX / cardRect.width) * 100).toFixed(1) + '%';
    const yPercent = ((centerY / cardRect.height) * 100).toFixed(1) + '%';
    
    console.log(`[${elementType}] Drag stopped at:`, { x: xPercent, y: yPercent, pixelX: d.x, pixelY: d.y });
    
    // Update state with new position
    onElementUpdate(id, elementType, { position: { x: xPercent, y: yPercent } });
    setIsDragging(null);
  };

  const handleResizeStop = (elementType, e, direction, ref, delta, position) => {
    if (!isInteractive || !onElementUpdate) return;
    
    const cardElement = document.getElementById(`card-${id}`);
    if (!cardElement) return;
    
    const cardRect = cardElement.getBoundingClientRect();
    const widthPercent = ((ref.offsetWidth / cardRect.width) * 100).toFixed(1) + '%';
    
    console.log(`[${elementType}] Resize stopped at width:`, widthPercent);
    
    onElementUpdate(id, elementType, { size: { width: widthPercent, height: 'auto' } });
  };

  const convertPercentToPixels = (percent, dimension) => {
    const value = parseFloat(percent);
    return (value / 100) * dimension;
  };

  if (!isInteractive) {
    // Static version for PDF export
    return (
      <div className="birthday-card-template">
        <img 
          src={templateBackground || `${process.env.PUBLIC_URL}/card_photo.png`}
          alt="Card Template"
          className="card-template-image"
          crossOrigin="anonymous"
        />
        
        <div 
          className="static-photo-container"
          style={{
            position: 'absolute',
            left: photoPosition.x,
            top: photoPosition.y,
            transform: 'translate(-50%, -50%)',
            width: photoSize.width,
            zIndex: 2
          }}
        >
          <img
            src={croppedUrl || previewUrl}
            alt="User"
            className="user-photo-static"
            crossOrigin="anonymous"
            style={{
              width: '100%',
              height: 'auto',
              aspectRatio: '3/4',
              objectFit: 'cover',
              borderRadius: '5px'
            }}
          />
        </div>
        
        <div
          className="static-text-name"
          style={{
            position: 'absolute',
            left: namePosition.x,
            top: namePosition.y,
            transform: 'translate(-50%, -50%)',
            ...nameStyle,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            zIndex: 2
          }}
        >
          {name}
        </div>
        
        {title && (
          <div
            className="static-text-title"
            style={{
              position: 'absolute',
              left: titlePosition.x,
              top: titlePosition.y,
              transform: 'translate(-50%, -50%)',
              ...titleStyle,
              textAlign: 'center',
              whiteSpace: 'nowrap',
              zIndex: 2
            }}
          >
            {title}
          </div>
        )}
      </div>
    );
  }

  // Interactive version for preview - calculate pixel positions from percentages
  const photoWidth = convertPercentToPixels(photoSize.width, cardDimensions.width);
  const photoHeight = photoWidth * 4 / 3; // 3:4 aspect ratio
  const photoX = convertPercentToPixels(photoPosition.x, cardDimensions.width) - (photoWidth / 2);
  const photoY = convertPercentToPixels(photoPosition.y, cardDimensions.height) - (photoHeight / 2);
  
  const nameX = convertPercentToPixels(namePosition.x, cardDimensions.width) - 50;
  const nameY = convertPercentToPixels(namePosition.y, cardDimensions.height) - 10;
  const titleX = convertPercentToPixels(titlePosition.x, cardDimensions.width) - 50;
  const titleY = convertPercentToPixels(titlePosition.y, cardDimensions.height) - 10;

  return (
    <div 
      ref={cardRef}
      id={`card-${id}`}
      className={`birthday-card-template ${isSelected ? 'card-selected' : ''}`}
      onClick={() => onCardSelect && onCardSelect(id)}
    >
      <img 
        src={templateBackground || `${process.env.PUBLIC_URL}/card_photo.png`}
        alt="Card Template"
        className="card-template-image"
        crossOrigin="anonymous"
      />
      
      <Rnd
        size={{ width: photoWidth, height: photoHeight }}
        position={{ x: photoX, y: photoY }}
        onDragStart={() => handleDragStart('photo')}
        onDragStop={(e, d) => handleDragStop('photo', e, d)}
        onResizeStop={(e, direction, ref, delta, position) => handleResizeStop('photo', e, direction, ref, delta, position)}
        bounds="parent"
        lockAspectRatio={3/4}
        className={`draggable-photo ${isDragging === 'photo' ? 'is-dragging' : ''}`}
        onClick={(e) => { e.stopPropagation(); onElementSelect && onElementSelect('photo'); }}
        enableUserSelectHack={false}
        disableDragging={false}
      >
        <img
          src={croppedUrl || previewUrl}
          alt="User"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '5px',
            border: selectedElement === 'photo' && isSelected ? '3px solid #6A0572' : isDragging === 'photo' ? '2px dashed #6A0572' : 'none',
            cursor: 'move',
            pointerEvents: 'none',
            userSelect: 'none'
          }}
          crossOrigin="anonymous"
          draggable="false"
        />
      </Rnd>

      <Rnd
        size={{ width: 100, height: 20 }}
        position={{ x: nameX, y: nameY }}
        onDragStart={() => handleDragStart('name')}
        onDragStop={(e, d) => handleDragStop('name', e, d)}
        bounds="parent"
        enableResizing={false}
        className={`draggable-text ${isDragging === 'name' ? 'is-dragging' : ''}`}
        onClick={(e) => { e.stopPropagation(); onElementSelect && onElementSelect('name'); }}
        enableUserSelectHack={false}
      >
        <div
          style={{
            ...nameStyle,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            cursor: 'move',
            textShadow: selectedElement === 'name' && isSelected ? '0 0 10px #6A0572' : 'none',
            padding: '2px 5px',
            background: selectedElement === 'name' && isSelected ? 'rgba(106, 5, 114, 0.2)' : isDragging === 'name' ? 'rgba(106, 5, 114, 0.1)' : 'transparent',
            borderRadius: '3px',
            border: isDragging === 'name' ? '1px dashed #6A0572' : 'none',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
        >
          {name}
        </div>
      </Rnd>

      {title && (
        <Rnd
          size={{ width: 100, height: 20 }}
          position={{ x: titleX, y: titleY }}
          onDragStart={() => handleDragStart('title')}
          onDragStop={(e, d) => handleDragStop('title', e, d)}
          bounds="parent"
          enableResizing={false}
          className={`draggable-text ${isDragging === 'title' ? 'is-dragging' : ''}`}
          onClick={(e) => { e.stopPropagation(); onElementSelect && onElementSelect('title'); }}
          enableUserSelectHack={false}
        >
          <div
            style={{
              ...titleStyle,
              textAlign: 'center',
              whiteSpace: 'nowrap',
              cursor: 'move',
              textShadow: selectedElement === 'title' && isSelected ? '0 0 10px #6A0572' : 'none',
              padding: '2px 5px',
              background: selectedElement === 'title' && isSelected ? 'rgba(106, 5, 114, 0.2)' : isDragging === 'title' ? 'rgba(106, 5, 114, 0.1)' : 'transparent',
              borderRadius: '3px',
              border: isDragging === 'title' ? '1px dashed #6A0572' : 'none',
              userSelect: 'none',
              pointerEvents: 'none'
            }}
          >
            {title}
          </div>
        </Rnd>
      )}
    </div>
  );
}

export default Card; 