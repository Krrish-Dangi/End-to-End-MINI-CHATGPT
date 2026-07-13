from pydantic import BaseModel, Field
from typing import Annotated

class ChatRequest(BaseModel):
    text: Annotated[str, Field(..., description="Start chatting with llama-3 model...", example="Hello!")]
    session_id: str
    user_id: str
