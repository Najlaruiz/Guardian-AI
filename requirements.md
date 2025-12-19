# Guardian AI - Requirements & Architecture

## Original Problem Statement
Build Guardian AI, a premium AI business and cybersecurity hub with:
- Homepage with hero section, animated particles, services preview, about section
- 3 Service pages with Stripe payment integration
- Contact page with form and email notifications
- Admin panel with JWT authentication
- AI chatbot using GPT-5.1
- Mixed theme (dark hero, light content areas)
- Pinterest-inspired premium design

## User Choices
- **AI Chatbot**: Emergent LLM Key (GPT-5.1)
- **Authentication**: JWT-based custom auth
- **Payments**: Stripe integration
- **Contact Form**: Database storage + email notifications via Resend
- **Design Theme**: Mixed (dark hero sections, light content areas)

## Architecture

### Tech Stack
- **Frontend**: React 19 + Tailwind CSS + Framer Motion + shadcn/ui
- **Backend**: FastAPI (Python) + Motor (async MongoDB)
- **Database**: MongoDB
- **AI**: GPT-5.1 via Emergent LLM Key
- **Payments**: Stripe Checkout via emergentintegrations
- **Email**: Resend API

### Database Collections
- `users` - Admin/user accounts with JWT auth
- `services` - Service definitions with pricing
- `contacts` - Contact form submissions
- `chat_messages` - AI chatbot conversation history
- `payment_transactions` - Stripe payment records

### API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login (JWT)
- `GET /api/auth/me` - Get current user
- `GET /api/services` - List all services
- `GET /api/services/{slug}` - Get service by slug
- `POST /api/contact` - Submit contact form
- `POST /api/chat` - Send chat message to AI
- `POST /api/payments/checkout` - Create Stripe checkout session
- `GET /api/payments/status/{session_id}` - Check payment status
- `GET /api/admin/dashboard` - Admin dashboard stats
- `GET /api/admin/contacts` - Admin contact list
- `GET /api/admin/payments` - Admin payment list

### Pages
- `/` - Homepage
- `/about` - About page
- `/contact` - Contact page
- `/services/:slug` - Individual service pages
- `/payment/success` - Payment success callback
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard

## Completed Tasks
1. ✅ Backend API with all routes
2. ✅ JWT authentication system
3. ✅ Stripe payment integration
4. ✅ AI chatbot with GPT-5.1
5. ✅ Contact form with email notifications
6. ✅ Admin dashboard with analytics
7. ✅ Premium UI with Syne/Manrope fonts
8. ✅ Dark/light hybrid theme
9. ✅ Particle animations
10. ✅ Framer Motion animations
11. ✅ Service seeding on startup

## Next Tasks / Enhancements
1. Add service image management in admin panel
2. Implement subscription management for recurring payments
3. Add analytics charts with more data visualization
4. Implement email templates for contact notifications
5. Add password reset functionality
6. Implement service editing in admin panel
7. Add customer testimonials section
8. Implement search functionality

## Admin Credentials
- **Email**: admin@guardianai.com
- **Password**: admin123
