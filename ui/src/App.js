import { useCallback, useEffect, useState } from 'react';

import Button from './components/button';
import TextField from './components/text-filed';

import logo from './logo.svg';
import './App.css';

const URL = "http://localhost:8000/api/chat";

async function sendRequest(msg) {
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg),
    });

    const json = await response.json();
    return json;
  } catch (error) {
    console.error(error.message);
    return {};
  }
}

function App() {
  const [history, setHistory] = useState([]);
  const [system, setSystem] = useState("");
  const [user, setUser] = useState("");

  const onClick = useCallback(async () => {
    console.log({ system, user });

    /* response: { system: "", user: "", assistant: "" } */
    const response = await sendRequest({ system, user });
    console.log({ response });

    setHistory(history => [...history, response]);
  }, [system, user, setHistory]);

  useEffect(() => {
    console.log({ history });
  }, [history]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <TextField placeholder="chat history" isReadOnly={true} value={(() => {
          let result = ""; for (const obj of history) {
            for (const [key, value] of Object.entries(obj)) {
              result += `${key}: ${value}\n`;
            }
            result += "\n";
          }
          return result;
        })()} setValue={() => { }} />
        <TextField placeholder="system prompt ......" value={system} setValue={(e) => setSystem(e.target.value)} />
        <TextField placeholder="your messages ......" value={user} setValue={(e) => setUser(e.target.value)} />
        <Button text="Submit" onClick={onClick} />
      </header>
    </div>
  );
}

export default App;
