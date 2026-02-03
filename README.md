# 🎂 Birthday Card Generator

A React web application that generates personalized birthday cards with photo uploads and name customization, exporting as a single A4 PDF with 4 cards arranged in a 2×2 grid.

## ✨ Features

- **Multi-Card Creation**: Design up to 4 personalized birthday cards simultaneously
- **Photo Upload & Cropping**: Upload and adjust photos to fit perfectly in the template
- **Custom Text**: Add names and designations for each recipient
- **Live Preview**: See real-time card previews as you make changes
- **PDF Export**: Download all cards as a single A4 PDF for printing
- **Responsive Design**: Works on all devices (desktop, tablet, mobile)
- **Optimized Performance**: Fast PDF generation with image compression

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/birthday-card-generator.git
cd birthday-card-generator

# Install dependencies
npm install

# Start development server
npm run dev

The app will be available at `http://localhost:3000`

## 📱 How to Use

1. **Create Your Cards**
   - Upload photos by clicking on the upload area
   - Adjust/crop photos to fit perfectly
   - Enter recipient names and designations

2. **Preview Cards**
   - Check the preview section to see how cards will appear
   - Make adjustments as needed

3. **Export to PDF**
   - Click "Download PDF" to generate an A4 page with all cards
   - Print the PDF or share it digitally

## 🛠️ Technical Details

### Built With
- **React 18** - Frontend library with hooks for state management
- **CSS3** - Custom styling with modern CSS features
- **html2canvas** - DOM-to-canvas conversion for PDF generation
- **jsPDF** - PDF creation and download functionality
- **react-easy-crop** - Image cropping functionality

### Performance Optimizations
- JPEG compression for smaller file sizes
- Reduced rendering scale for faster PDF generation
- Removal of heavy shadows during export

## 📁 Project Structure

/
├── public/
│   ├── card_photo.png      # Card template image
│   └── index.html          # HTML template
├── src/
│   ├── components/
│   │   └── PhotoCropper.jsx # Photo cropping component
│   ├── utils/
│   │   └── image.js        # Image processing utilities
│   ├── App.js             # Main application component
│   ├── Card.js            # Card component
│   ├── App.css            # Application styles
│   ├── index.css          # Global styles
│   └── index.js           # React entry point
└── package.json           # Project dependencies and scripts
```

## 🎨 Customization

### Modifying the Template
- Replace `public/card_photo.png` with your own template design
- Adjust photo positioning in `Card.js` if necessary
- Modify colors in `App.css` to match your template

### Styling
The app uses a purple color scheme that can be modified in `App.css`:
- Primary: `#6A0572` (Deep Purple)
- Secondary: `#8B008B` (Dark Magenta)
- Background: Linear gradient `#f5f7fa` to `#c3cfe2`

1. **PDF Generation Problems**
   - Ensure all images have loaded completely
   - Check browser console for errors
   - Try using Chrome for best compatibility

2. **Image Upload Issues**
   - Use JPG or PNG formats
   - Image size should preferably be under 5MB
   - Ensure your browser is up to date

3. **Responsive Layout Issues**
   - Try refreshing the page
   - Test in different browsers
   - Check CSS media queries in developer tools

## 👨‍💻 Contributors

### Developed By
- Chand Kavar (230801313) - B.C.A. Sem-5
- Sezan Patani (240802125) - B.Sc.I.T. Sem-3
- Raj Jadav (230801240) - B.C.A. Sem-5
- Keval Lathiya (230801347) - B.C.A. Sem-5

### Managed By
Department of Computer Science, Faculty of Science, Atmiya University

## 📄 License

This project is available as open source under the terms of the MIT License.

**Created with ❤️ by the Birthday Card Generator Team** 
