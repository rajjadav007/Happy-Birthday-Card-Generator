function Card({ image, name, title, previewUrl }) {
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

  return (
    <div className="birthday-card-template">
      {/* Template background */}
      <img 
        src={`${process.env.PUBLIC_URL}/card_photo.png`}
        alt="Card Template"
        className="card-template-image"
        crossOrigin="anonymous"
      />
      
      {/* Photo container that automatically fits the photo */}
      <div className="photo-frame">
        <div className="photo-container">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="User"
              className="user-photo-in-frame"
              crossOrigin="anonymous"
              style={{
                objectPosition: 'center center'
              }}
            />
          ) : null}
        </div>
      </div>
      
      {/* Name and designation below frame */}
      <div className="user-info-template">
        <div className="user-name">{name}</div>
        {title && <div className="user-course">{title}</div>}
      </div>
    </div>
  );
}

export default Card; 