import os
import time
import httpx
from dotenv import load_dotenv
from google import genai
from google.genai import errors

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def ask_gemini(prompt: str):

    for attempt in range(3):

        try:
            response = client.models.generate_content(
                model="gemini-3.6-flash",
                contents=prompt
            )

            return response.text

        except (
            errors.ServerError,
            httpx.RemoteProtocolError,
            httpx.ConnectError,
            httpx.ReadTimeout
        ) as e:

            if attempt == 2:
                raise

            print(
                f"Gemini temporary error. "
                f"Retrying... ({attempt + 1}/3)"
            )

            time.sleep(5)