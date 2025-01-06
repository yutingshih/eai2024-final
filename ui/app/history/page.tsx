'use client'
import { useContext } from "react";
import { Context } from "../layout";

export default function Histroy() {
    const { history } = useContext(Context);

    return (
        <>
            <div>This is history page.</div>
            <div style={{ white-space: "pre-line" }}>{history}</div>
        </>
    )
}
