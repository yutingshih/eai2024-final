from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
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

app.mount("/static", StaticFiles(directory="templates/static"), name="static")

templates = Jinja2Templates(directory="templates")

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

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", { "request": request })

@app.get("/init")
async def init():
    history = read_history()
    return history

@app.post("/api/chat")
async def chat(request: Request):
    json = await request.json()
    json["assistant"] = model.call(model.map(json))
    history = read_history()
    history.append(json)
    write_history(history)
    return json
