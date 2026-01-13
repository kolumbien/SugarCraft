from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models
from .database import engine
from .routers import articles, factories, shops

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SugarCraft API",
    description="API for managing food business shops, factories, and articles.",
    version="1.0.0"
)

# CORS setup
origins = [
    "http://localhost",
    "http://localhost:5173", # Vite dev server
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(articles.router)
app.include_router(factories.router)
app.include_router(shops.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to SugarCraft API"}
