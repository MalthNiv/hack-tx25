import { useState, useEffect, useRef } from "react";



export default function CardDetail({ card, onBack }) {

    const [messages, setMessages] = useState([]);

    const [input, setInput] = useState("");

    const [botTyping, setBotTyping] = useState(false);

    const [isFlipped, setIsFlipped] = useState(false);

    const revealIntervalRef = useRef(null);

    const inputRef = useRef(null);



    useEffect(() => {

        inputRef.current?.focus();

    }, []);



    useEffect(() => {

        if (!card?.name) return;



        setMessages([

            {

                sender: "bot",

                text: `Hello there. You've drawn the **${card.name}** card. Let me share what it reveals...`,

            },

        ]);



        const timer = setTimeout(() => fetchCardReading([]), 50);

        return () => clearTimeout(timer);

    }, [card]);



    useEffect(() => {

        return () => {

            if (revealIntervalRef.current) clearInterval(revealIntervalRef.current);

        };

    }, []);



    const revealTextWordByWord = (fullText, addFinal = true) => {

        setMessages((prev) => [...prev, { sender: "bot", text: "" }]);

        setBotTyping(true);



        const words = fullText.split(/\s+/);

        let idx = 0;

        const delay = 120;



        revealIntervalRef.current = setInterval(() => {

            idx++;

            setMessages((prev) => {

                const copy = prev.map((m) => ({ ...m }));

                const lastBotIndex = copy.map((m) => m.sender).lastIndexOf("bot");

                if (lastBotIndex === -1) return copy;

                copy[lastBotIndex].text = words.slice(0, idx).join(" ");

                return copy;

            });



            if (idx >= words.length) {

                clearInterval(revealIntervalRef.current);

                revealIntervalRef.current = null;

                setBotTyping(false);

                if (addFinal) {

                    setMessages((prev) => {

                        const copy = prev.map((m) => ({ ...m }));

                        const lastBotIndex = copy.map((m) => m.sender).lastIndexOf("bot");

                        if (lastBotIndex !== -1) copy[lastBotIndex].text = fullText;

                        return copy;

                    });

                }

            }

        }, delay);

    };



    const fetchCardReading = async (conversationMessages) => {

        if (!card?.name) return;



        setBotTyping(true);

        try {

            const res = await fetch("/api/chat", {

                method: "POST",

                headers: { "Content-Type": "application/json" },

                body: JSON.stringify({

                    card: {

                        name: card.name || "",

                        conversation: conversationMessages.map((m) => `${m.sender}: ${m.text}`).join("\n"),

                    },

                }),

            });



            const data = await res.json();



            if (!res.ok) throw new Error(data.error || "Server error");



            revealTextWordByWord(data.reply || "No response from server.");

        } catch (err) {

            console.error("API fetch failed:", err);

            setMessages((prev) => [

                ...prev,

                { sender: "bot", text: "Hmm, something went wrong. Please try again later." },

            ]);

            setBotTyping(false);

        }

    };



    const handleSend = async () => {

        if (!input.trim() || botTyping) return;

        const userMessage = { sender: "user", text: input.trim() };

        const newMessages = [...messages, userMessage];

        setMessages(newMessages);

        setInput("");

        await fetchCardReading(newMessages);

    };



    if (!card) return null;



    return (

        <div className="py-6 sm:py-8 md:py-10 px-4 sm:px-6 md:px-10 bg-gray-50 bg-[url('/design/card-int.png')] bg-cover bg-center min-h-screen">

            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-10 mx-auto max-w-7xl lg:h-[calc(100vh-12rem)] min-h-[600px] transition-all duration-300">



                {/* LEFT: Card */}

                <div className="w-full sm:w-[90%] md:w-[80%] lg:w-auto flex justify-center items-stretch h-[600px] lg:h-full">

                    <div

                        className={`h-full cursor-pointer ${!isFlipped ? "pulse-until-click" : ""}`}


                        style={{ perspective: "1000px", width: "auto", maxWidth: "100%", aspectRatio: "3/3" }}

                        onClick={() => setIsFlipped(!isFlipped)}

                    >

                        <div

                            className="w-full h-full relative"

                            style={{

                                transformStyle: "preserve-3d",

                                transition: "transform 0.8s",

                                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",

                            }}

                        >

                            {/* BACK */}

                            <div

                                className="rounded-3xl shadow-lg"

                                style={{

                                    position: "absolute",

                                    width: "100%",

                                    height: "100%",

                                    backfaceVisibility: "hidden",

                                    display: "flex",

                                    alignItems: "center",

                                    justifyContent: "center",

                                }}

                            >

                                <img

                                    src="/design/HackTX.png"

                                    alt="Tarot card"

                                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"

                                />

                            </div>



                            {/* FRONT */}

                            <div

                                style={{

                                    position: "absolute",

                                    width: "100%",

                                    height: "100%",

                                    backfaceVisibility: "hidden",

                                    transform: "rotateY(180deg)",

                                    display: "flex",

                                    alignItems: "center",

                                    justifyContent: "center",

                                }}

                            >

                                <img

                                    src={card.image}

                                    alt={card.name}

                                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"

                                />

                            </div>

                        </div>

                    </div>

                </div>



                {/* RIGHT: Chat */}

                <div className="flex-1 flex flex-col border rounded-2xl bg-white shadow-2xl overflow-hidden h-[600px] lg:h-full min-w-[280px]">

                    {/* messages */}

                    <div className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">

                        {messages.map((msg, idx) => (

                            <div

                                key={idx}

                                className={`flex items-end ${msg.sender === "user" ? "justify-end" : "justify-start"}`}

                            >

                                {msg.sender === "bot" && (

                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#e9d8a0] flex items-center justify-center text-white mr-2 text-xs sm:text-sm">B</div>

                                )}

                                {msg.sender === "user" && (

                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#01051a] flex items-center justify-center text-white ml-2 text-xs sm:text-sm order-2">U</div>

                                )}

                                <div

                                    className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg max-w-[75%] break-words shadow ${msg.sender === "user" ? "bg-[#01051a] text-white rounded-br-none" : "bg-[#e9d8a0] text-[#01051a] rounded-bl-none"

                                        }`}

                                >

                                    {msg.text}

                                </div>

                            </div>

                        ))}



                        {botTyping && (

                            <div className="flex items-end justify-start">

                                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#e9d8a0] flex items-center justify-center text-white mr-2 text-xs sm:text-sm">B</div>

                                <div className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg max-w-[50%] bg-[#e9d8a0] text-[#01051a] shadow animate-pulse rounded-bl-none">

                                    Typing...

                                </div>

                            </div>

                        )}

                    </div>



                    {/* Input */}

                    <div className="flex p-3 sm:p-4 border-t bg-gray-50">

                        <input

                            ref={inputRef}

                            type="text"

                            value={input}

                            onChange={(e) => setInput(e.target.value)}

                            placeholder="Type a message..."

                            onKeyDown={(e) => e.key === "Enter" && handleSend()}

                            className="flex-1 border rounded-l-lg px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-gray-500 text-sm sm:text-base"

                        />

                        <button

                            onClick={handleSend}

                            className="bg-[#01051a] text-white px-4 py-2 rounded-r hover:bg-[#e9d8a0] transition-colors hover:text-gray-700"

                        >

                            Send

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}