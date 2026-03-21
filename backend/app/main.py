from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.ai import router as ai_router
from app.routes.analyze import router as analyze_router
from app.routes.insights import router as insights_router
from app.routes.transactions import router as transactions_router


app = FastAPI(
    title="ValueVista API",
    version="0.1.0",
    description="AI Financial Copilot backend for PPP-based value analysis.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router, prefix="/api")
app.include_router(insights_router, prefix="/api")
app.include_router(transactions_router, prefix="/api")
app.include_router(ai_router, prefix="/api")


@app.get("/health")
def health_check() -> dict:
    return {"status": "ok"}
