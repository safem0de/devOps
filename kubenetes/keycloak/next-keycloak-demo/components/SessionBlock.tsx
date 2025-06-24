import { Session } from "next-auth";
import { useRef } from "react";

function SessionBlock({ session }: { session: Session | null }) {
    const preRef = useRef<HTMLPreElement>(null);

    const handleCopy = () => {
        if (preRef.current) {
            navigator.clipboard.writeText(preRef.current.innerText);
        }
    };

    return (
        <div style={{ position: "relative", marginTop: 10 }}>
            <button className="session-copy-btn" onClick={handleCopy}>
                Copy
            </button>
            <pre className="session-box" ref={preRef}>
                {JSON.stringify(session, null, 2)}
            </pre>
        </div>
    );
}

export default SessionBlock