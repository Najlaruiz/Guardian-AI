from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Body
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Initialize Resend
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@guardianai.com')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'guardian-ai-secret')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Create the main app
app = FastAPI(title="Guardian AI API")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ==================== MODELS ====================

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class ServiceCreate(BaseModel):
    title: str
    slug: str
    short_description: str
    full_description: str
    features: List[str]
    pricing: List[Dict[str, Any]]
    image_url: Optional[str] = None
    icon: str = "Shield"

class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    features: Optional[List[str]] = None
    pricing: Optional[List[Dict[str, Any]]] = None
    image_url: Optional[str] = None
    icon: Optional[str] = None

class ServiceResponse(BaseModel):
    id: str
    title: str
    slug: str
    short_description: str
    full_description: str
    features: List[str]
    pricing: List[Dict[str, Any]]
    image_url: Optional[str]
    icon: str
    created_at: str

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str

class ContactResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str]
    subject: str
    message: str
    status: str
    created_at: str

class ChatMessageCreate(BaseModel):
    message: str
    session_id: str

class ChatMessageResponse(BaseModel):
    id: str
    session_id: str
    user_message: str
    ai_response: str
    created_at: str

class CheckoutRequest(BaseModel):
    service_id: str
    pricing_id: str
    origin_url: str

class PaymentStatusResponse(BaseModel):
    status: str
    payment_status: str
    amount: float
    currency: str

# ==================== AUTH HELPERS ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"id": payload["sub"]}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def require_admin(user: dict = Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ==================== AUTH ROUTES ====================

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "email": user_data.email,
        "password": hash_password(user_data.password),
        "name": user_data.name,
        "role": "user",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    
    token = create_token(user_id, user_data.email, "user")
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user_id,
            email=user_data.email,
            name=user_data.name,
            role="user",
            created_at=user_doc["created_at"]
        )
    )

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user["id"], user["email"], user["role"])
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user["id"],
            email=user["email"],
            name=user["name"],
            role=user["role"],
            created_at=user["created_at"]
        )
    )

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(user: dict = Depends(get_current_user)):
    return UserResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        role=user["role"],
        created_at=user["created_at"]
    )

# ==================== SERVICES ROUTES ====================

@api_router.get("/services", response_model=List[ServiceResponse])
async def get_services():
    services = await db.services.find({}, {"_id": 0}).to_list(100)
    return services

@api_router.get("/services/{slug}", response_model=ServiceResponse)
async def get_service(slug: str):
    service = await db.services.find_one({"slug": slug}, {"_id": 0})
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@api_router.post("/services", response_model=ServiceResponse)
async def create_service(service: ServiceCreate, admin: dict = Depends(require_admin)):
    service_id = str(uuid.uuid4())
    service_doc = {
        "id": service_id,
        **service.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.services.insert_one(service_doc)
    return ServiceResponse(**service_doc)

@api_router.put("/services/{service_id}", response_model=ServiceResponse)
async def update_service(service_id: str, updates: ServiceUpdate, admin: dict = Depends(require_admin)):
    update_data = {k: v for k, v in updates.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No updates provided")
    
    result = await db.services.update_one({"id": service_id}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    
    service = await db.services.find_one({"id": service_id}, {"_id": 0})
    return ServiceResponse(**service)

@api_router.delete("/services/{service_id}")
async def delete_service(service_id: str, admin: dict = Depends(require_admin)):
    result = await db.services.delete_one({"id": service_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"message": "Service deleted"}

# ==================== CONTACT ROUTES ====================

@api_router.post("/contact", response_model=ContactResponse)
async def submit_contact(contact: ContactCreate):
    contact_id = str(uuid.uuid4())
    contact_doc = {
        "id": contact_id,
        **contact.model_dump(),
        "status": "new",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.contacts.insert_one(contact_doc)
    
    # Send email notification
    try:
        html_content = f"""
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> {contact.name}</p>
        <p><strong>Email:</strong> {contact.email}</p>
        <p><strong>Phone:</strong> {contact.phone or 'Not provided'}</p>
        <p><strong>Subject:</strong> {contact.subject}</p>
        <p><strong>Message:</strong></p>
        <p>{contact.message}</p>
        """
        params = {
            "from": SENDER_EMAIL,
            "to": [ADMIN_EMAIL],
            "subject": f"New Contact: {contact.subject}",
            "html": html_content
        }
        await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Contact notification email sent for {contact_id}")
    except Exception as e:
        logger.error(f"Failed to send contact email: {e}")
    
    return ContactResponse(**contact_doc)

@api_router.get("/admin/contacts", response_model=List[ContactResponse])
async def get_contacts(admin: dict = Depends(require_admin)):
    contacts = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return contacts

@api_router.put("/admin/contacts/{contact_id}/status")
async def update_contact_status(contact_id: str, status: str = Body(..., embed=True), admin: dict = Depends(require_admin)):
    result = await db.contacts.update_one({"id": contact_id}, {"$set": {"status": status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": "Status updated"}

# ==================== CHAT ROUTES ====================

@api_router.post("/chat", response_model=ChatMessageResponse)
async def send_chat_message(chat_data: ChatMessageCreate):
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    
    chat_id = str(uuid.uuid4())
    
    try:
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        chat = LlmChat(
            api_key=api_key,
            session_id=chat_data.session_id,
            system_message="""You are Guardian AI's intelligent assistant, specializing in cybersecurity and AI business solutions. 
            You help visitors understand our services:
            1. Data & Device Protection ($199/month) - Comprehensive security for devices and data
            2. Cybersecurity Consultation ($299/session or $499 full audit) - Expert analysis and recommendations
            3. Automated AI Solutions ($499/project or $99/month) - Custom AI automation for businesses
            
            Be professional, helpful, and knowledgeable. Guide users to appropriate services based on their needs.
            Keep responses concise but informative."""
        ).with_model("openai", "gpt-5.1")
        
        user_message = UserMessage(text=chat_data.message)
        ai_response = await chat.send_message(user_message)
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        ai_response = "I apologize, but I'm experiencing technical difficulties. Please try again or contact us directly for assistance."
    
    chat_doc = {
        "id": chat_id,
        "session_id": chat_data.session_id,
        "user_message": chat_data.message,
        "ai_response": ai_response,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.chat_messages.insert_one(chat_doc)
    
    return ChatMessageResponse(**chat_doc)

@api_router.get("/chat/{session_id}", response_model=List[ChatMessageResponse])
async def get_chat_history(session_id: str):
    messages = await db.chat_messages.find({"session_id": session_id}, {"_id": 0}).sort("created_at", 1).to_list(100)
    return messages

@api_router.get("/admin/chat-analytics")
async def get_chat_analytics(admin: dict = Depends(require_admin)):
    total_messages = await db.chat_messages.count_documents({})
    unique_sessions = len(await db.chat_messages.distinct("session_id"))
    recent_messages = await db.chat_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(20)
    
    return {
        "total_messages": total_messages,
        "unique_sessions": unique_sessions,
        "recent_messages": recent_messages
    }

# ==================== PAYMENT ROUTES ====================

PRICING_CONFIG = {
    "data-protection-monthly": {"amount": 199.00, "name": "Data & Device Protection - Monthly"},
    "consultation-session": {"amount": 299.00, "name": "Cybersecurity Consultation - Session"},
    "consultation-audit": {"amount": 499.00, "name": "Cybersecurity Consultation - Full Audit"},
    "ai-solutions-project": {"amount": 499.00, "name": "AI Solutions - Per Project"},
    "ai-solutions-monthly": {"amount": 99.00, "name": "AI Solutions - Monthly Subscription"},
}

@api_router.post("/payments/checkout")
async def create_checkout(request: CheckoutRequest, http_request: Request):
    from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionRequest
    
    pricing_id = request.pricing_id
    if pricing_id not in PRICING_CONFIG:
        raise HTTPException(status_code=400, detail="Invalid pricing option")
    
    pricing = PRICING_CONFIG[pricing_id]
    
    api_key = os.environ.get('STRIPE_API_KEY')
    host_url = request.origin_url.rstrip('/')
    webhook_url = f"{str(http_request.base_url).rstrip('/')}/api/webhook/stripe"
    
    stripe_checkout = StripeCheckout(api_key=api_key, webhook_url=webhook_url)
    
    success_url = f"{host_url}/payment/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{host_url}/services"
    
    checkout_request = CheckoutSessionRequest(
        amount=pricing["amount"],
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "service_id": request.service_id,
            "pricing_id": pricing_id,
            "pricing_name": pricing["name"]
        }
    )
    
    session = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Create payment transaction record
    transaction_id = str(uuid.uuid4())
    transaction_doc = {
        "id": transaction_id,
        "session_id": session.session_id,
        "amount": pricing["amount"],
        "currency": "usd",
        "service_id": request.service_id,
        "pricing_id": pricing_id,
        "pricing_name": pricing["name"],
        "payment_status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.payment_transactions.insert_one(transaction_doc)
    
    return {"checkout_url": session.url, "session_id": session.session_id}

@api_router.get("/payments/status/{session_id}")
async def get_payment_status(session_id: str):
    from emergentintegrations.payments.stripe.checkout import StripeCheckout
    
    api_key = os.environ.get('STRIPE_API_KEY')
    stripe_checkout = StripeCheckout(api_key=api_key, webhook_url="")
    
    try:
        status = await stripe_checkout.get_checkout_status(session_id)
        
        # Update transaction in database
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {"payment_status": status.payment_status, "status": status.status}}
        )
        
        return PaymentStatusResponse(
            status=status.status,
            payment_status=status.payment_status,
            amount=status.amount_total / 100,
            currency=status.currency
        )
    except Exception as e:
        logger.error(f"Payment status error: {e}")
        raise HTTPException(status_code=400, detail="Failed to get payment status")

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    from emergentintegrations.payments.stripe.checkout import StripeCheckout
    
    body = await request.body()
    signature = request.headers.get("Stripe-Signature", "")
    
    api_key = os.environ.get('STRIPE_API_KEY')
    stripe_checkout = StripeCheckout(api_key=api_key, webhook_url="")
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, signature)
        
        if webhook_response.payment_status == "paid":
            await db.payment_transactions.update_one(
                {"session_id": webhook_response.session_id},
                {"$set": {"payment_status": "paid", "status": "complete"}}
            )
            logger.info(f"Payment completed for session {webhook_response.session_id}")
        
        return {"status": "received"}
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return {"status": "error"}

@api_router.get("/admin/payments", response_model=List[dict])
async def get_payments(admin: dict = Depends(require_admin)):
    payments = await db.payment_transactions.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return payments

# ==================== ADMIN DASHBOARD ====================

@api_router.get("/admin/dashboard")
async def get_dashboard_stats(admin: dict = Depends(require_admin)):
    total_contacts = await db.contacts.count_documents({})
    new_contacts = await db.contacts.count_documents({"status": "new"})
    total_chat_sessions = len(await db.chat_messages.distinct("session_id"))
    total_payments = await db.payment_transactions.count_documents({})
    successful_payments = await db.payment_transactions.count_documents({"payment_status": "paid"})
    
    # Revenue calculation
    paid_transactions = await db.payment_transactions.find({"payment_status": "paid"}, {"_id": 0, "amount": 1}).to_list(1000)
    total_revenue = sum(t.get("amount", 0) for t in paid_transactions)
    
    return {
        "total_contacts": total_contacts,
        "new_contacts": new_contacts,
        "total_chat_sessions": total_chat_sessions,
        "total_payments": total_payments,
        "successful_payments": successful_payments,
        "total_revenue": total_revenue
    }

# ==================== SEED DEFAULT SERVICES ====================

@api_router.post("/seed-services")
async def seed_services():
    existing = await db.services.count_documents({})
    if existing > 0:
        return {"message": "Services already exist"}
    
    default_services = [
        {
            "id": str(uuid.uuid4()),
            "title": "Data & Device Protection",
            "slug": "data-device-protection",
            "short_description": "Comprehensive security for all your devices and sensitive data with AI-powered threat detection.",
            "full_description": "Our Data & Device Protection service provides enterprise-grade security for individuals and businesses. Using advanced AI algorithms, we continuously monitor your devices and data for potential threats, automatically blocking malicious activities before they can cause harm. Our solution includes real-time threat detection, automated backup systems, encryption protocols, and 24/7 monitoring.",
            "features": [
                "Real-time threat detection and blocking",
                "AI-powered malware analysis",
                "Automated data backup and recovery",
                "End-to-end encryption",
                "Multi-device protection",
                "24/7 security monitoring",
                "Monthly security reports"
            ],
            "pricing": [
                {"id": "data-protection-monthly", "name": "Monthly Plan", "price": 199, "period": "month", "features": ["All protection features", "Up to 10 devices", "24/7 support"]}
            ],
            "image_url": "https://images.unsplash.com/photo-1698669993523-bcf101a925ef?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxjeWJlcnNlY3VyaXR5JTIwYWJzdHJhY3QlMjBuZXR3b3JrJTIwbm9kZXMlMjBkYXJrJTIwYmFja2dyb3VuZHxlbnwwfHx8Ymx1ZXwxNzY2MTE1OTAyfDA&ixlib=rb-4.1.0&q=85",
            "icon": "Shield",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Cybersecurity Consultation",
            "slug": "cybersecurity-consultation",
            "short_description": "Expert analysis and strategic recommendations to fortify your digital infrastructure.",
            "full_description": "Our Cybersecurity Consultation service connects you with industry-leading security experts who analyze your current infrastructure, identify vulnerabilities, and provide actionable recommendations. Whether you need a quick assessment or a comprehensive security audit, our team delivers insights that protect your business from evolving cyber threats.",
            "features": [
                "Comprehensive vulnerability assessment",
                "Penetration testing",
                "Security architecture review",
                "Compliance gap analysis",
                "Risk assessment and mitigation strategies",
                "Custom security roadmap",
                "Executive summary and detailed reports"
            ],
            "pricing": [
                {"id": "consultation-session", "name": "Single Session", "price": 299, "period": "session", "features": ["2-hour consultation", "Preliminary assessment", "Action items report"]},
                {"id": "consultation-audit", "name": "Full Security Audit", "price": 499, "period": "one-time", "features": ["Complete infrastructure review", "Penetration testing", "Detailed report with recommendations"]}
            ],
            "image_url": "https://images.pexels.com/photos/8439094/pexels-photo-8439094.jpeg",
            "icon": "Search",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "id": str(uuid.uuid4()),
            "title": "Automated AI Solutions",
            "slug": "automated-ai-solutions",
            "short_description": "Custom AI automation to streamline your business operations and enhance productivity.",
            "full_description": "Transform your business with our Automated AI Solutions. We design and implement custom AI systems that automate repetitive tasks, analyze data patterns, and provide intelligent insights. From customer service chatbots to predictive analytics, our solutions help businesses operate more efficiently while reducing costs and human error.",
            "features": [
                "Custom AI model development",
                "Process automation",
                "Intelligent chatbots",
                "Predictive analytics",
                "Natural language processing",
                "Integration with existing systems",
                "Ongoing optimization and support"
            ],
            "pricing": [
                {"id": "ai-solutions-project", "name": "Per Project", "price": 499, "period": "one-time", "features": ["Custom AI solution", "Implementation support", "30-day warranty"]},
                {"id": "ai-solutions-monthly", "name": "Monthly Subscription", "price": 99, "period": "month", "features": ["Ongoing AI support", "Regular optimizations", "Priority support"]}
            ],
            "image_url": "https://images.pexels.com/photos/31587202/pexels-photo-31587202.jpeg",
            "icon": "Cpu",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    
    await db.services.insert_many(default_services)
    return {"message": "Default services created", "count": len(default_services)}

# ==================== CREATE DEFAULT ADMIN ====================

@api_router.post("/seed-admin")
async def seed_admin():
    existing = await db.users.find_one({"role": "admin"})
    if existing:
        return {"message": "Admin already exists", "email": existing["email"]}
    
    admin_id = str(uuid.uuid4())
    admin_doc = {
        "id": admin_id,
        "email": "admin@guardianai.com",
        "password": hash_password("admin123"),
        "name": "Admin",
        "role": "admin",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(admin_doc)
    return {"message": "Admin created", "email": "admin@guardianai.com", "password": "admin123"}

# ==================== ROOT ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Guardian AI API", "version": "1.0.0"}

@api_router.get("/health")
async def health():
    return {"status": "healthy"}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Auto-seed services and admin on startup if database is empty"""
    try:
        # Check if services exist, if not, seed them
        services_count = await db.services.count_documents({})
        if services_count == 0:
            logger.info("No services found, seeding default services...")
            default_services = [
                {
                    "id": str(uuid.uuid4()),
                    "title": "Data & Device Protection",
                    "slug": "data-device-protection",
                    "short_description": "Comprehensive security for all your devices and sensitive data with AI-powered threat detection.",
                    "full_description": "Our Data & Device Protection service provides enterprise-grade security for individuals and businesses. Using advanced AI algorithms, we continuously monitor your devices and data for potential threats, automatically blocking malicious activities before they can cause harm. Our solution includes real-time threat detection, automated backup systems, encryption protocols, and 24/7 monitoring.",
                    "features": [
                        "Real-time threat detection and blocking",
                        "AI-powered malware analysis",
                        "Automated data backup and recovery",
                        "End-to-end encryption",
                        "Multi-device protection",
                        "24/7 security monitoring",
                        "Monthly security reports"
                    ],
                    "pricing": [
                        {"id": "data-protection-monthly", "name": "Monthly Plan", "price": 199, "period": "month", "features": ["All protection features", "Up to 10 devices", "24/7 support"]}
                    ],
                    "image_url": "https://images.unsplash.com/photo-1698669993523-bcf101a925ef?w=800",
                    "icon": "Shield",
                    "created_at": datetime.now(timezone.utc).isoformat()
                },
                {
                    "id": str(uuid.uuid4()),
                    "title": "Cybersecurity Consultation",
                    "slug": "cybersecurity-consultation",
                    "short_description": "Expert analysis and strategic recommendations to fortify your digital infrastructure.",
                    "full_description": "Our Cybersecurity Consultation service connects you with industry-leading security experts who analyze your current infrastructure, identify vulnerabilities, and provide actionable recommendations. Whether you need a quick assessment or a comprehensive security audit, our team delivers insights that protect your business from evolving cyber threats.",
                    "features": [
                        "Comprehensive vulnerability assessment",
                        "Penetration testing",
                        "Security architecture review",
                        "Compliance gap analysis",
                        "Risk assessment and mitigation strategies",
                        "Custom security roadmap",
                        "Executive summary and detailed reports"
                    ],
                    "pricing": [
                        {"id": "consultation-session", "name": "Single Session", "price": 299, "period": "session", "features": ["2-hour consultation", "Preliminary assessment", "Action items report"]},
                        {"id": "consultation-audit", "name": "Full Security Audit", "price": 499, "period": "one-time", "features": ["Complete infrastructure review", "Penetration testing", "Detailed report with recommendations"]}
                    ],
                    "image_url": "https://images.pexels.com/photos/8439094/pexels-photo-8439094.jpeg",
                    "icon": "Search",
                    "created_at": datetime.now(timezone.utc).isoformat()
                },
                {
                    "id": str(uuid.uuid4()),
                    "title": "Automated AI Solutions",
                    "slug": "automated-ai-solutions",
                    "short_description": "Custom AI automation to streamline your business operations and enhance productivity.",
                    "full_description": "Transform your business with our Automated AI Solutions. We design and implement custom AI systems that automate repetitive tasks, analyze data patterns, and provide intelligent insights. From customer service chatbots to predictive analytics, our solutions help businesses operate more efficiently while reducing costs and human error.",
                    "features": [
                        "Custom AI model development",
                        "Process automation",
                        "Intelligent chatbots",
                        "Predictive analytics",
                        "Natural language processing",
                        "Integration with existing systems",
                        "Ongoing optimization and support"
                    ],
                    "pricing": [
                        {"id": "ai-solutions-project", "name": "Per Project", "price": 499, "period": "one-time", "features": ["Custom AI solution", "Implementation support", "30-day warranty"]},
                        {"id": "ai-solutions-monthly", "name": "Monthly Subscription", "price": 99, "period": "month", "features": ["Ongoing AI support", "Regular optimizations", "Priority support"]}
                    ],
                    "image_url": "https://images.pexels.com/photos/31587202/pexels-photo-31587202.jpeg",
                    "icon": "Cpu",
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
            ]
            await db.services.insert_many(default_services)
            logger.info("Default services seeded successfully")
        
        # Check if admin exists, if not, seed admin
        admin_exists = await db.users.find_one({"role": "admin"})
        if not admin_exists:
            logger.info("No admin found, seeding default admin...")
            admin_id = str(uuid.uuid4())
            admin_doc = {
                "id": admin_id,
                "email": "admin@guardianai.com",
                "password": hash_password("admin123"),
                "name": "Admin",
                "role": "admin",
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            await db.users.insert_one(admin_doc)
            logger.info("Default admin seeded successfully")
        
        logger.info("Guardian AI API started successfully")
    except Exception as e:
        logger.error(f"Startup error: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
