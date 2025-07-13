# To run this code you need to install the following dependencies:
# pip install google-genai

import base64
import os
from google import genai
from google.genai import types
from dotenv import load_dotenv


load_dotenv()

def generate():
    client = genai.Client(
        api_key=os.environ.get("GEMINI_API_KEY"),
    )

    model = "gemini-2.5-pro"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text="""Hello, how are you?"""),
            ],
        ),
    ]

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
    ):
        print(chunk.text, end="")

if __name__ == "__main__":
    generate()
