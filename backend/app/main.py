from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def root():
    return {"message": "AI Career Agent Backend is running!"}