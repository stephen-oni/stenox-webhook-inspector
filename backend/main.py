import os
import uuid
import json
import shutil
from fastapi import FastAPI, Depends, HTTPException, status, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List

from database import engine, Base, get_db
from models import User, WebhookRequest
from schemas import UserCreate, UserLogin, UserResponse, WebhookRequestResponse, ForgotPasswordRequest, ResetPasswordSubmit
from auth import get_password_hash, verify_password, create_access_token, get_current_user, create_password_reset_token, verify_password_reset_token
from email_service import send_password_reset_email

Base.metadata.create_all(bind=engine)
os.makedirs("uploads", exist_ok=True)

app = FastAPI(title="SteNox API")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/auth/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(
        full_name=user.full_name,
        email=user.email,
        password_hash=get_password_hash(user.password),
        endpoint_id=f"ep_{uuid.uuid4().hex[:12]}"
    )
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}

@app.post("/api/auth/login")
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_credentials.email).first()
    if not user or not verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": str(user.id)})
    return {
        "token": access_token,
        "user": {"id": user.id, "full_name": user.full_name, "email": user.email, "profile_picture_url": user.profile_picture_url, "endpoint_id": user.endpoint_id}
    }

@app.post("/api/auth/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if user:
        token = create_password_reset_token(user.email)
        try:
            send_password_reset_email(user.email, token)
        except Exception as e:
            raise HTTPException(status_code=500, detail="Failed to dispatch email")
    return {"message": "If an account exists, a reset link has been dispatched"}

@app.post("/api/auth/reset-password")
def reset_password(req: ResetPasswordSubmit, db: Session = Depends(get_db)):
    email = verify_password_reset_token(req.token)
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password_hash = get_password_hash(req.new_password)
    db.commit()
    return {"message": "Password updated successfully"}

@app.api_route("/api/collect/{endpoint_id}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def collect_webhook(endpoint_id: str, request: Request, db: Session = Depends(get_db)):
    if not db.query(User).filter(User.endpoint_id == endpoint_id).first():
        raise HTTPException(status_code=404, detail="Ingestion endpoint not found")

    body_bytes = await request.body()
    body_str = body_bytes.decode("utf-8") if body_bytes else ""
    headers_dict = dict(request.headers)
    client_ip = headers_dict.get("x-forwarded-for", request.client.host if request.client else "unknown").split(",")[0]

    db.add(WebhookRequest(endpoint_id=endpoint_id, http_method=request.method, headers=json.dumps(headers_dict), body=body_str, remote_ip=client_ip))
    db.commit()
    return {"status": "captured"}

@app.get("/api/requests/{endpoint_id}", response_model=List[WebhookRequestResponse])
def get_requests(endpoint_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.endpoint_id != endpoint_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return db.query(WebhookRequest).filter(WebhookRequest.endpoint_id == endpoint_id).order_by(WebhookRequest.created_at.desc()).all()

@app.delete("/api/requests/clear/{endpoint_id}")
def clear_all_requests(endpoint_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.endpoint_id != endpoint_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    db.query(WebhookRequest).filter(WebhookRequest.endpoint_id == endpoint_id).delete()
    db.commit()
    return {"status": "cleared"}

@app.put("/api/profile/photo")
async def update_profile_photo(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in [".jpg", ".jpeg", ".png", ".webp"]:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, or WEBP images allowed")

    filename = f"avatar_{current_user.id}_{uuid.uuid4().hex[:8]}{file_ext}"
    file_path = os.path.join("uploads", filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    photo_url = f"http://localhost:8000/uploads/{filename}"
    current_user.profile_picture_url = photo_url
    db.commit()
    db.refresh(current_user)

    return {"profile_picture_url": photo_url}

@app.get("/healthz")
def health_check():
    return {"status": "healthy"}