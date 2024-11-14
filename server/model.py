from pexpect import spawn
import re

ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')

proc = spawn("ollama run llama3.1:8b", encoding="utf-8")
proc.expect(">>> ")

def call(msg):
    proc.sendline(msg)
    proc.expect(">>> ")

    text = proc.before.replace("\r\n... ", "")
    text = ansi_escape.sub('', text)

    return text.split("\r\n", 1)[1][2:]

def map(json):
    str = "<|begin_of_text|>"

    if json["system"] != "":
        str += "<|start_header_id|>system<|end_header_id|>"
        str += json["system"]
        str += "<|eot_id|>"

    if json["user"] != "":
        str += "<|start_header_id|>user<|end_header_id|>"
        str += json["user"]
        str += "<|eot_id|>"

    str += "<|start_header_id|>assistant<|end_header_id|>"
    return str
