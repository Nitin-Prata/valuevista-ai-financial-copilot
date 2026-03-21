from typing import Optional

from google import genai

from app.utils.config import get_gemini_settings


class GeminiClient:
    def __init__(self) -> None:
        settings = get_gemini_settings()
        self.api_key = settings["api_key"]
        self.model_name = settings["model"]
        self._client = None

    def is_enabled(self) -> bool:
        return bool(self.api_key)

    def _configure(self) -> None:
        if self._client is not None:
            return
        self._client = genai.Client(api_key=self.api_key)

    def generate_text(self, prompt: str) -> Optional[str]:
        if not self.is_enabled():
            return None
        try:
            self._configure()
            response = self._client.models.generate_content(
                model=self.model_name,
                contents=prompt,
            )
            text = getattr(response, "text", None)
            if text:
                return text.strip()
            return None
        except Exception:
            return None
