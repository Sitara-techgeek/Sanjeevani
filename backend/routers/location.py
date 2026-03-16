from fastapi import APIRouter
from fastapi.middleware.cors import CORSMiddleware
import socketio
from sqlalchemy.orm import Session
from database import SessionLocal
import models
from datetime import datetime

router = APIRouter()

# Socket.io server — replaces WebSocket
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
socket_app = socketio.ASGIApp(sio)

@sio.event
async def connect(sid, environ):
    print(f'Client connected: {sid}')

@sio.event
async def disconnect(sid):
    print(f'Client disconnected: {sid}')

@sio.event
async def location_update(sid, data):
    user_id = data.get('userId')
    lat     = data.get('latitude')
    lng     = data.get('longitude')

    if not all([user_id, lat, lng]):
        return

    db = SessionLocal()
    try:
        loc = db.query(models.AmbulanceLocation).filter(
            models.AmbulanceLocation.user_id == user_id
        ).first()
        if loc:
            loc.latitude   = lat
            loc.longitude  = lng
            loc.updated_at = datetime.utcnow()
        else:
            db.add(models.AmbulanceLocation(user_id=user_id, latitude=lat, longitude=lng))
        db.commit()
    finally:
        db.close()

    await sio.emit('location_ack', {'status': 'ok', 'lat': lat, 'lng': lng}, to=sid)