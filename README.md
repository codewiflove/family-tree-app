# 🌳 Salasilah Keluarga - Family Tree MVP App

A Progressive Web App (PWA) for managing family trees with local storage, built with Vite React. Designed for Malaysian families with Bahasa Melayu interface.

## ✨ Features

### 📊 Dashboard Module
- Personalized greeting "Hai, [User Name]!"
- Statistics cards: Total Members, Active Generations, Family Branches
- Big CTA button for adding first family member
- Upcoming birthday notifications

### 🌳 Family Tree Module
- Interactive visual tree chart showing family hierarchy
- Node cards with profile picture, name, age, phone, job, location
- Edit and add child/spouse functionality
- Vertical/horizontal tree orientation

### 📋 Directory Module
- Vertical list view of all family members
- Classification by gender (Lelaki / Perempuan)
- Communication buttons: Call (tel: link), WhatsApp (wa.me API link)
- Search and filter functionality

## 🛠️ Tech Stack

- **Frontend:** Vite React
- **State Management:** React Hooks + Local Storage
- **Visualization:** react-d3-tree
- **Icons:** react-icons
- **Date Handling:** date-fns
- **Styling:** CSS3 with modern gradients and animations

## 📁 Data Model

Local Storage table "Profil_Keluarga" with fields:
- `id` (unique)
- `nama_penuh`
- `jantina` (Lelaki/Perempuan)
- `tarikh_lahir` (for age calculation & birthday notifications)
- `no_telefon`
- `pekerjaan`
- `lokasi` (Daerah/Negeri)
- `gambar_profil_url`
- `parent_id` (links child to parent)
- `spouse_id` (links husband/wife)

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd family-tree-app
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open browser at `http://localhost:5173`

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🌐 Deployment

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy with default settings

### Option 2: Netlify
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select repository and deploy

### Option 3: GitHub Pages
1. Update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/your-repo-name/',
  // ... other config
})
```

2. Build and deploy:
```bash
npm run build
npm run deploy
```

## 📱 PWA Features

This app is PWA-ready with:
- Offline capability (via service worker)
- Installable to home screen
- Responsive design for all devices
- Fast loading with Vite

## 🔧 Development

### Project Structure
```
family-tree-app/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── FamilyTree.jsx
│   │   ├── Directory.jsx
│   │   ├── MemberForm.jsx
│   │   └── MemberCard.jsx
│   ├── utils/
│   │   ├── storage.js
│   │   └── sampleData.js
│   ├── App.jsx
│   └── main.jsx
├── public/
└── package.json
```

### Adding New Features
1. Create component in `src/components/`
2. Add corresponding CSS file
3. Import and use in main App
4. Update storage utilities if needed

## 📝 Usage Guide

### Adding First Family Member
1. Open the app
2. Click "+ Tambah Ahli Pertama (Akar)" on Dashboard
3. Fill in the form
4. Submit to create root member

### Building Family Tree
1. Go to "Pokok Keluarga" tab
2. Click on any member node
3. Use "Tambah Anak" or "Tambah Pasangan" buttons
4. Fill form to add relationship

### Managing Directory
1. Go to "Direktori" tab
2. Use search to find members
3. Filter by gender if needed
4. Click communication buttons to call/WhatsApp

### Data Management
- **Export:** Use export buttons to download JSON/CSV
- **Import:** Replace localStorage data manually
- **Backup:** Regular backups recommended

## 🎨 Design Principles

- **Malaysian Context:** Bahasa Melayu UI with local terms
- **Family-Friendly:** Clean, intuitive interface for all ages
- **Accessibility:** High contrast, readable fonts
- **Responsive:** Works on mobile, tablet, and desktop
- **Performance:** Fast loading with minimal dependencies

## 🔒 Privacy & Security

- **No Login Required:** Works entirely offline
- **Local Storage:** Data stays in user's browser
- **No External Servers:** No data sent to cloud
- **Export/Backup:** Users control their data

## 🚫 Out of Scope (MVP)

- Image/video gallery uploads
- Donation/death contribution system
- In-app chat (use WhatsApp only)
- Cloud synchronization
- User authentication

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built for Malaysian families
- Inspired by traditional family tree books
- Designed with accessibility in mind
- Special thanks to all beta testers

## 📞 Support

For issues or questions:
1. Check existing issues
2. Create new issue with details
3. Provide screenshots if possible

---

**Made with ❤️ for keluarga Malaysia**