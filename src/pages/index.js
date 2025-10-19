import { useState } from "react";
import CardDeck from "../components/CardDeck";
import CardDetail from "../components/CardDetail";
import TeamSection from "../components/TeamSection";
import cardsData from "../data/cards.json";
import { useEffect } from "react";

export default function Home() {
    const [selectedCard, setSelectedCard] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);

        history.replaceState(null, "", window.location.pathname);
    }, []);

    return (
        <div className="min-h-screen bg-[#01051a]">
            <header
                className="relative w-full h-screen flex flex-col items-center justify-center text-center bg-cover bg-center"
                style={{ backgroundImage: "url('/design/welcome-bg.png')" }}
            >
                <img
                    src="/design/text.png"
                    alt="Some text"
                    className="w-full h-screen"
                />
            </header>
            <button
                onClick={() => {
                    const section = document.getElementById("card-deck");
                    if (section) {
                        section.scrollIntoView({ behavior: "smooth" });
                    }
                }}
                className="absolute w-16 h-16 md:w-20 md:h-20 animate-bounce hover:scale-110 transition-transform"
                style={{
                    bottom: "6vh", 
                    right: "29vw",   
                }}
                title="Scroll Down"
            >
                <img
                    src="/design/scroll-down.png"
                    alt="Scroll Down"
                    className="md:w-18.5 md:h-18.5 object-contain"
                />
            </button>

            <div id="card-deck">
                {!selectedCard && <CardDeck cards={cardsData} onSelect={setSelectedCard} />}
            </div>

            {/* Card Detail Section }
            {selectedCard && <CardDetail card={selectedCard} onBack={() => setSelectedCard(null)} />*/}

            {/* Team Section */}
            <TeamSection />
        </div>
    );
}