from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import model

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Load or initialize data
HISTORY_FILE = "history.json"

if not os.path.exists(HISTORY_FILE):
    with open(HISTORY_FILE, "w") as f:
        json.dump([], f)

def read_history():
    with open(HISTORY_FILE, "r") as f:
        return json.load(f)

def write_history(data):
    with open(HISTORY_FILE, "w") as f:
        json.dump(data, f)

@app.get("/init")
async def init():
    history = read_history()
    return history

# check server is alive or not
@app.get("/api/ping", status_code=200)
async def pong():
    return

@app.post("/api/chat")
async def chat(request: Request):
    json = await request.json()
    json["assistant"] = model.call(model.map(json))
    history = read_history()
    history.append(json)
    write_history(history)
    return json
