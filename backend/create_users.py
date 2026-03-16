from database import SessionLocal, engine, Base
import models
import bcrypt

Base.metadata.create_all(bind=engine)

def create_user(email, name, role, password):
    db = SessionLocal()
    try:
        hashed = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        user = models.User(
            email=email,
            name=name,
            role=role,
            password=hashed,
            is_active=True
        )
        db.add(user)
        db.commit()
        print(f"Created {role}: {email}")
    finally:
        db.close()

create_user("admin@ayusetu.com",     "Admin",       "admin",     "Admin@123")
create_user("paramedic@ayusetu.com", "Paramedic 1", "ambulance", "Para@123")

print("All users created successfully")