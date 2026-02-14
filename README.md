# Bongg.dev - Personal Website

A high-performance, cyberpunk-lite personal website for BonggXz - Fullstack Developer & IoT Enthusiast. Built with modern web technologies and optimized to run on a 2GB RAM VPS.

## 🌟 Features

- **Modern Stack**: Remix v2 with Vite, TypeScript, Tailwind CSS
- **Database**: MongoDB Atlas with Prisma ORM
- **Stunning UI**: Custom animations (sparkles, typewriter, border beams, 3D cards)
- **Portfolio Showcase**: Categorized projects (Web, Roblox, IoT, Design)
- **Digital Shop**: Product listings with WhatsApp checkout integration
- **Blog System**: Markdown-based blog with syntax highlighting
- **Admin Dashboard**: Full CRUD operations for content management
- **Performance**: Optimized for low-resource VPS deployment
- **Dark Mode**: Professional dark theme by default
- **Responsive**: Mobile-first design approach

## 📸 Screenshots

_Screenshots will be added here_

## 🛠️ Tech Stack

### Frontend
- **Framework**: Remix v2 (React Router based)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix primitives)
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js (LTS)
- **Database**: MongoDB Atlas (Free Tier M0)
- **ORM**: Prisma
- **Auth**: Cookie-based sessions with bcrypt
- **Process Manager**: PM2

### Key Libraries
- `react-markdown` - Markdown rendering
- `rehype-highlight` - Code syntax highlighting
- `bcrypt` - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher
- **MongoDB Atlas Account**: Free tier available at [mongodb.com/atlas](https://www.mongodb.com/atlas)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/DevilSlebew/bongg-web.git
cd bongg-web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` and update the following variables:

```env
# MongoDB connection string from MongoDB Atlas
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/bonggdb?retryWrites=true&w=majority"

# Random secret key for session encryption (generate a strong random string)
SESSION_SECRET="your-super-secret-session-key-change-this"
```

**Getting MongoDB Atlas Connection String:**
1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (M0 Free tier)
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Click "Connect" → "Connect your application" to get the connection string

### 4. Database Setup

Generate Prisma client and push schema to MongoDB:

```bash
npx prisma generate
npx prisma db push
```

### 5. Create Admin User (Optional)

You can create an admin user directly in MongoDB Atlas or use the Prisma Studio:

```bash
npx prisma studio
```

Then add an admin user manually with:
- `username`: your_username
- `password`: (hashed) - Use bcrypt to hash your password

Or use this Node.js script:

```javascript
// create-admin.js
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  const username = 'admin';
  const password = await bcrypt.hash('your_password_here', 10);
  
  await prisma.admin.create({
    data: { username, password }
  });
  
  console.log('Admin created!');
  await prisma.$disconnect();
}

createAdmin();
```

### 6. Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 7. Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
bongg-web/
├── app/
│   ├── components/
│   │   ├── ui/              # Shadcn UI components
│   │   ├── layout/          # Navbar, Footer, ProgressBar
│   │   ├── effects/         # Custom animations (Sparkles, Typewriter, etc.)
│   │   ├── sections/        # Hero, BentoShowcase
│   │   ├── portfolio/       # Project cards and filters
│   │   ├── shop/            # Product cards
│   │   ├── blog/            # Blog cards and markdown renderer
│   │   └── admin/           # Admin forms and tables
│   ├── lib/
│   │   ├── db.server.ts          # Prisma client singleton
│   │   ├── auth.server.ts        # Authentication utilities
│   │   ├── utils.ts              # Helper functions
│   │   └── markdown.server.ts    # Markdown parsing
│   ├── routes/
│   │   ├── _index.tsx            # Landing page
│   │   ├── about.tsx             # About page
│   │   ├── portfolio.tsx         # Portfolio listing
│   │   ├── portfolio.$slug.tsx   # Project detail
│   │   ├── shop.tsx              # Shop page
│   │   ├── blog._index.tsx       # Blog listing
│   │   ├── blog.$slug.tsx        # Blog post detail
│   │   ├── admin._index.tsx      # Admin login
│   │   ├── admin.dashboard.tsx   # Admin dashboard
│   │   └── admin.projects.tsx    # Projects management
│   ├── root.tsx                  # Root layout
│   └── tailwind.css              # Global styles
├── prisma/
│   └── schema.prisma             # Database schema
├── public/                       # Static assets
├── ecosystem.config.js           # PM2 configuration
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

## 🚢 Deployment

### VPS Deployment with PM2

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Install PM2 globally (if not already installed):**
   ```bash
   npm install -g pm2
   ```

3. **Start with PM2:**
   ```bash
   pm2 start ecosystem.config.js
   ```

4. **Useful PM2 commands:**
   ```bash
   pm2 list                 # List all processes
   pm2 logs bongg-web       # View logs
   pm2 restart bongg-web    # Restart the app
   pm2 stop bongg-web       # Stop the app
   pm2 delete bongg-web     # Delete the process
   ```

5. **Setup PM2 to start on system boot:**
   ```bash
   pm2 startup
   pm2 save
   ```

### Resource Optimization

The application is configured to run efficiently on a 2GB RAM VPS:
- Maximum memory restart set to 512MB
- Single instance (fork mode)
- Prisma client singleton to prevent connection exhaustion
- Lazy loading of heavy components

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MongoDB Atlas connection string | Yes |
| `SESSION_SECRET` | Secret key for session encryption | Yes |

## 🎨 Design System

### Colors
- **Background**: `zinc-950` (Dark)
- **Foreground**: `zinc-50` (Light text)
- **Primary**: `cyan-500` (Cyan accent)
- **Secondary**: `violet-500` (Violet accent)
- **Accent**: `emerald-500` (Green accent)

### Fonts
- **Sans**: Inter (from Google Fonts)
- **Mono**: JetBrains Mono (from Google Fonts)

### Border Radius
- Default: `0.5rem`

## 📝 Content Management

Access the admin panel at `/admin` to manage:

1. **Projects**: Add, edit, delete portfolio projects
2. **Products**: Manage shop products
3. **Blog Posts**: Create and publish blog content

### Admin Features
- Full CRUD operations
- Rich content editing
- Image URL management
- Category/tag filtering
- Featured content highlighting
- Draft/published status

## 🛡️ Security

- Password hashing with bcrypt (10 rounds)
- HTTP-only session cookies
- Secure cookies in production
- TypeScript strict mode
- Input validation on forms

## 📄 License

MIT License - feel free to use this project for your own portfolio!

## 👨‍💻 Author

**BonggXz**
- Student at MAN 1 Jepara
- Fullstack Developer
- Roblox Scripter
- IoT Engineer

## 🤝 Contributing

This is a personal portfolio project, but suggestions and feedback are welcome!

## 📞 Support

For issues or questions, please open an issue on GitHub or contact via:
- **GitHub**: [@bonggxz](https://github.com/bonggxz)
- **Email**: bonggxz@example.com

---

Built with ❤️ using Remix, TypeScript, and Tailwind CSS