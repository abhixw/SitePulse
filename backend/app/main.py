from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.analyze import router as analyze_router


app = FastAPI(
    title="SitePulse - Web Performance Audit API",
    version="1.0.0"
)

# ----------------------------
# CORS Configuration
# ----------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Routers
# ----------------------------

app.include_router(analyze_router)

# ----------------------------
# Health Check Endpoint
# ----------------------------

@app.get("/health")
async def health_check():
    return {"status": "healthy"}