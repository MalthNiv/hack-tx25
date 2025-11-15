import { useState, useEffect, useRef } from "react";

import dynamic from "next/dynamic";

import CardDetail from "../components/CardDetail";

import TeamSection from "../components/TeamSection";

import ScrollButton from "../components/ScrollButton";

import cardsData from "../data/cards.json";

// Disable SSR for CardDeck to avoid hydration mismatches

const CardDeck = dynamic(() => import("../components/CardDeck"), {

    ssr: false,

});



export default function Home() {

    const [selectedCard, setSelectedCard] = useState(null);

    const [showScrollButton, setShowScrollButton] = useState(false);

    const headerRef = useRef(null);

    const resizeObserverRef = useRef(null);



    useEffect(() => {

        window.scrollTo(0, 0);

        history.replaceState(null, "", window.location.pathname);

    }, []);



    useEffect(() => {

        const checkHeaderHeight = () => {

            if (!headerRef.current) return;

            const headerHeight = headerRef.current.offsetHeight;

            const viewportHeight = window.innerHeight;

            const threshold = viewportHeight * 0.75;

            setShowScrollButton(headerHeight >= threshold);

        };



        // Check on mount with a small delay to ensure header is rendered

        const timeoutId = setTimeout(() => {

            checkHeaderHeight();

            // Set up ResizeObserver after initial check

            if (headerRef.current) {

                resizeObserverRef.current = new ResizeObserver(() => {

                    checkHeaderHeight();

                });

                resizeObserverRef.current.observe(headerRef.current);

            }

        }, 100);



        // Also listen to window resize

        window.addEventListener("resize", checkHeaderHeight);



        return () => {

            clearTimeout(timeoutId);

            if (resizeObserverRef.current) {

                resizeObserverRef.current.disconnect();

                resizeObserverRef.current = null;

            }

            window.removeEventListener("resize", checkHeaderHeight);

        };

    }, []);



    return (

        <div className="bg-[#01051a]">

            <header

                ref={headerRef}

                className="relative aspect-16/9 flex justify-center text-center bg-contain bg-no-repeat bg-center"

                style={{ backgroundImage: "url('/design/welcome-bg.png')" }}

            >

                {showScrollButton && <ScrollButton />}

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

                className="relative aspect-16/9 flex items-center justify-center text-center bg-contain bg-no-repeat bg-center"

                style={{ backgroundImage: "url('/design/about.png')" }}

            >

            </header>

            <TeamSection />

        </div>

    );

}