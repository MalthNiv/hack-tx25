import { useState } from "react";
import CardDeck from "../components/CardDeck";
import CardDetail from "../components/CardDetail";
import TeamSection from "../components/TeamSection";
import cardsData from "../data/cards.json";

export default function Home() {
    const [selectedCard, setSelectedCard] = useState(null);

return (
    <div className="min-h-screen bg-white p-8"> 
    {/* Welcome Section */} 
    <header className="text-center mb-10"> 
        <img src="/images/parrot-logo.png" className="mx-auto w-32" /> 
        <h1 className="text-3xl font-bold mt-4">Welcome to the Parrot Oracle</h1> 
        <p className="mt-2 text-gray-600">Pick a card and see what the parrot says!</p> 
        </header> 
        
        {/* Card Deck Section */} {
        !selectedCard && (<CardDeck cards={cardsData} onSelect={setSelectedCard} />)} 
        
        {/* Card Detail Section */} 
        {selectedCard && <CardDetail card={selectedCard} onBack={() => setSelectedCard(null)} />} 
            
        {/* Team Section */} 
        <TeamSection /> 
        </div>
        ); 
}