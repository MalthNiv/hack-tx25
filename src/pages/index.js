import { useState } from "react";
import CardDeck from "../components/CardDeck";
import CardDetail from "../components/CardDetail";
import TeamSection from "../components/TeamSection";
import cardsData from "../data/cards.json";

export default function Home() {
    const [selectedCard, setSelectedCard] = useState(null);

return (
    <div className="min-h-screen bg-white"> 
        <header
            className="relative w-full h-screen flex flex-col items-center justify-center text-center bg-cover bg-center"
            style={{ backgroundImage: "url('/design/welcome-bg.png')" }}
        >
        </header>
        <a
            href="#card-deck"
            className="absolute bottom-11 right-[28%] transform -translate-x-1/2 w-16 h-16 md:w-20 md:h-20 animate-bounce hover:scale-110 transition-transform"
            title="Scroll Down"
        >
            <img
                src="/design/scroll-down.png"
                alt="Scroll Down"
                className="w-full h-full object-contain"
            />
        </a>
        
        <div id="card-deck" className="py-16">
            {!selectedCard && <CardDeck cards={cardsData} onSelect={setSelectedCard} />}
        </div>
        
        {/* Card Detail Section */} 
        {selectedCard && <CardDetail card={selectedCard} onBack={() => setSelectedCard(null)} />} 
            
        {/* Team Section */} 
        <TeamSection /> 
        </div>
        ); 
}