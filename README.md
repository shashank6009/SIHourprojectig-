# PM Internship Scheme Portal

A government-themed web portal for the PM Internship Scheme built with Next.js 14, TypeScript, and Tailwind CSS.

## 🎯 Features

- **Government-themed Design**: Professional UI following Indian government website standards
- **Interactive Elements**: 
  - Video backgrounds (home.mp4, companies.mp4)
  - Interactive hover areas on images
  - Smooth animations and transitions
- **Resume Parsing**: 
  - Drag & drop resume upload
  - Automatic field extraction from PDF, DOCX, and TXT files
  - Manual text paste option
- **Multilingual Support**: English, Hindi, and Tamil
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Responsive Design**: Works on all device sizes

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/shashank6009/SIHourprojectig-.git
cd SIHourprojectig-
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. **Important**: Add video files
   - Place `home.mp4` in the `public/` directory
   - Place `companies.mp4` in the `public/` directory
   - These files are not included in the repository due to size limitations

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
├── public/
│   ├── Modi1.png, Modi2.png, Modi3.png  # PM images
│   ├── top.png                          # Navigation bar background
│   ├── pagebelow.png                    # Interactive eligibility image
│   ├── belowpagebelow.png              # Interactive India map
│   ├── test-resume.txt                  # Sample resume for testing
│   └── [video files - add manually]
├── src/
│   ├── app/
│   │   ├── api/parse-resume/           # Resume parsing API
│   │   ├── internship/                 # Internship application page
│   │   └── page.tsx                    # Home page
│   ├── components/
│   │   ├── ui/                         # Reusable UI components
│   │   ├── GovHeaderTop.tsx           # Top government header
│   │   ├── MainNav.tsx                # Main navigation
│   │   └── GovFooter.tsx              # Footer component
│   └── lib/
│       ├── i18n.ts                    # Internationalization
│       └── utils.ts                   # Utility functions
```

## 🎨 Design System

- **Colors**: 
  - Saffron (#FF9933)
  - White (#FFFFFF)
  - Green (#138808)
  - Navy Blue (#0B3D91)
- **Typography**: Noto Sans font family
- **Government branding elements integrated throughout**

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file for any environment-specific configuration.

### Video Files
Due to GitHub's file size limitations (100MB), video files must be added manually:
1. Download/obtain `home.mp4` and `companies.mp4`
2. Place them in the `public/` directory

## 📝 Resume Parsing

The application supports:
- PDF files (server-side parsing)
- DOCX files (server-side parsing)
- TXT files
- Manual text paste

Extracted fields include:
- Personal information (name, email, phone, address)
- Education details
- Skills and certifications
- Work experience
- And more...

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of the Smart India Hackathon (SIH) initiative.

## 🙏 Acknowledgments

- PM Internship Scheme initiative
- Smart India Hackathon
- Government of India