import os

from dotenv import load_dotenv


load_dotenv()


def get_env(name: str, default: str = "") -> str:
    return os.getenv(name, default).strip()


def get_gemini_settings() -> dict:
    return {
        "api_key": get_env("GEMINI_API_KEY"),
        "model": get_env("GEMINI_MODEL", "gemini-2.5-flash-lite"),
    }
