import { useState, useEffect } from "react";

import CardDeck from "../components/CardDeck";

import CardDetail from "../components/CardDetail";

import TeamSection from "../components/TeamSection";

import ScrollButton from "../components/ScrollButton";

import cardsData from "../data/cards.json";



export default function Home() {

    const [selectedCard, setSelectedCard] = useState(null);



    useEffect(() => {

        window.scrollTo(0, 0);

        history.replaceState(null, "", window.location.pathname);

    }, []);



    return (

        <div className="min-h-screen bg-[#01051a]">

            <header

                className="relative w-full h-screen flex items-center justify-center text-center bg-cover bg-center"

                style={{ backgroundImage: "url('/design/welcome-bg.png')" }}

            >

                <ScrollButton />

            </header>



            <div id="card-deck" className="pt-16 pb-20">

                {!selectedCard && (

                    <CardDeck cards={cardsData} onSelect={setSelectedCard} />

                )}

            </div>



            {/* Optional Card Detail Section */}

            {/* {selectedCard && (

        <CardDetail card={selectedCard} onBack={() => setSelectedCard(null)} />

      )} */}



            <header

                className="relative w-full h-screen flex items-center justify-center text-center bg-cover bg-center"

                style={{ backgroundImage: "url('/design/about.png')" }}

            >

            </header>

            <TeamSection />

        </div>

    );

}