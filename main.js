import { CreateWebWorkerMLCEngine } from "https://esm.sh/@mlc-ai/web-llm";

let engine;

async function initEngine() {
    const outputSpan = document.getElementById('chat-output');
    outputSpan.textContent = "Loading model...";
    
    engine = await CreateWebWorkerMLCEngine(
        new Worker(new URL("./worker.js", import.meta.url), { type: "module" }),
        "Llama-3-8B-Instruct-q4f16_1", 
        { initProgressCallback: (report) => outputSpan.textContent = report.text }
    );
    outputSpan.textContent = "Model ready.";
}

async function sendMessage() {
    const input = document.getElementById('chat-input').value;
    const outputSpan = document.getElementById('chat-output');
    
    outputSpan.textContent = "Thinking...";
    
    const messages = [
        { role: "system", content: "Ты — финансовый помощник." },
        { role: "user", content: input }
    ];

    const reply = await engine.chat.completions.create({ messages });
    outputSpan.textContent = reply.choices[0].message.content;
}

document.getElementById('exec_chat').addEventListener('click', sendMessage);

initEngine();


document.getElementById('exec_calc').addEventListener('click', () => {
    const P = parseFloat(document.getElementById('amount').value);
    const r = parseFloat(document.getElementById('interest').value) / 100;
    const n = parseFloat(document.getElementById('length').value);

    if (r === 0) {
        document.getElementById('mpayment').textContent = (P / n).toFixed(2);
        document.getElementById('payback').textContent = P.toFixed(2);
        document.getElementById('interestpay').textContent = "0";
    } else {
        const payment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalPayback = payment * n;
        document.getElementById('mpayment').textContent = payment.toFixed(2);
        document.getElementById('payback').textContent = totalPayback.toFixed(2);
        document.getElementById('interestpay').textContent = (totalPayback - P).toFixed(2);
    }
});

document.getElementById('exec_debt').addEventListener('click', () => {
    const inc = parseFloat(document.getElementById('income').value);
    const out = parseFloat(document.getElementById('outcome').value);
    const debt = parseFloat(document.getElementById('loan').value);
    
    // Расчеты
    const dti = debt / inc; // Debt-to-Income ratio
    const cushion = inc - out - debt;
    
    // Статусная логика (по твоему алгоритму)
    let statusText = "";
    if (debt > inc * 0.3) {
        statusText = "DEBT";
    } else if (inc < (out + debt) * 1.25) {
        statusText = "Low cushion";
    } else {
        statusText = "SAFE";
    }

    document.getElementById('status').textContent = statusText;
    document.getElementById('Cushion').textContent = cushion.toFixed(2);
    document.getElementById('ratio').textContent = (dti * 100).toFixed(1) + "%";
});
