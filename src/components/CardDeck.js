import { useState, useEffect, useRef, useCallback } from "react";

import { motion, AnimatePresence } from "framer-motion";

import CardDetail from "./CardDetail";



export default function CardDeck({ cards }) {

    const [selectedCard, setSelectedCard] = useState(null);

    const [glowingCard, setGlowingCard] = useState(null);

    const [fadeOut, setFadeOut] = useState(false);

    const [isSelecting, setIsSelecting] = useState(false);

    const [isAutoScrolling, setIsAutoScrolling] = useState(false);



    const deckRef = useRef(null);

    const detailsRef = useRef(null);

    const fadeOutTimeoutRef = useRef(null);



    const total = cards.length;

    const back_of_card = "/design/back-of-card.png";



    // --- Responsive card size ---

    const getCardSize = () => {

        if (typeof window === "undefined") return { width: 220, height: 293 };

        const vw = window.innerWidth;

        const vh = window.innerHeight;



        // Base card width: 15% of viewport width, but scale up on larger screens

        const width = Math.min(Math.max(vw * 0.15, 160), 350);

        const height = (width * 4) / 3; // maintain 4:3 ratio

        return { width, height };

    };

    const { width: cardWidth, height: cardHeight } = getCardSize();



    // --- Responsive radius ---

    const getRadius = () => {

        if (typeof window === "undefined") return 250;

        const vw = window.innerWidth;

        const vh = window.innerHeight;



        // Make radius proportional to viewport, bigger on desktop

        const radius = Math.min(Math.max(vw * 0.2, 160), vh * 0.4);

        return radius;

    };

    const radius = getRadius();



    // --- Dynamic spread to fit all cards ---

    const getSpread = () => {

        if (typeof window === "undefined") return 80;

        const vw = window.innerWidth;



        // Reduce spread for small screens, increase for large

        if (vw < 640) return 30; // mobile

        if (vw < 1024) return 60; // tablet

        return 90; // desktop

    };

    const spread = getSpread();

    const startAngle = -spread / 2;

    const angleIncrement = total > 1 ? spread / (total - 1) : 0;



    // --- Handle card click ---

    const handleCardClick = useCallback(

        (clickedCard) => {

            if (isSelecting) return;

            setIsSelecting(true);



            if (fadeOutTimeoutRef.current) {

                clearTimeout(fadeOutTimeoutRef.current);

                fadeOutTimeoutRef.current = null;

            }



            setGlowingCard(clickedCard.id);

            setSelectedCard({ ...clickedCard });



            if (cards.length > 0) { const randomIndex = Math.floor(Math.random() * cards.length); const randomCard = cards[randomIndex]; setSelectedCard({ ...randomCard }); }



            setFadeOut(false);

            setTimeout(() => setIsSelecting(false), 700);

        },

        [isSelecting]

    );



    // --- Smooth scroll to details ---

    useEffect(() => {

        if (!selectedCard || !deckRef.current) return;

        setIsAutoScrolling(true);



        const targetPosition =

            detailsRef.current.offsetTop +

            detailsRef.current.offsetHeight -

            window.innerHeight;

        const startPosition = window.scrollY;

        const distance = targetPosition - startPosition;

        const duration = 600;

        let startTime = null;



        const animateScroll = (currentTime) => {

            if (!startTime) startTime = currentTime;

            const elapsed = currentTime - startTime;

            const progress = Math.min(elapsed / duration, 1);

            const ease =

                progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;



            window.scrollTo(0, startPosition + distance * ease - 40);

            if (elapsed < duration) requestAnimationFrame(animateScroll);

            else setIsAutoScrolling(false);

        };



        requestAnimationFrame(animateScroll);

    }, [selectedCard]);



    // --- Fade out on scroll up ---

    useEffect(() => {

        let debounceTimeout;

        const handleScroll = () => {

            if (isAutoScrolling) return;

            clearTimeout(debounceTimeout);

            debounceTimeout = setTimeout(() => {

                if (!deckRef.current) return;

                const deckTop = deckRef.current.getBoundingClientRect().top + window.scrollY;

                const scrollY = window.scrollY;



                if (selectedCard && scrollY < deckTop + 50) {

                    if (fadeOutTimeoutRef.current) clearTimeout(fadeOutTimeoutRef.current);



                    setFadeOut(true);



                    fadeOutTimeoutRef.current = setTimeout(() => {

                        setSelectedCard(null);

                        setGlowingCard(null);

                        setFadeOut(false);

                        fadeOutTimeoutRef.current = null;

                    }, 50);

                }

            }, 50);

        };



        window.addEventListener("scroll", handleScroll);

        return () => {

            clearTimeout(debounceTimeout);

            if (fadeOutTimeoutRef.current) clearTimeout(fadeOutTimeoutRef.current);

            window.removeEventListener("scroll", handleScroll);

        };

    }, [selectedCard, isAutoScrolling]);



    return (

        <div className="flex flex-col items-center space-y-8">

            {/* Card Deck */}

            <div

                ref={deckRef}

                className="relative w-full flex items-center justify-center bg-[url('/design/page_design_2.png')] bg-cover bg-center overflow-visible px-2 sm:px-4"

                style={{

                    height: "60vh", // larger deck for visibility

                    maxHeight: "700px",

                    pointerEvents: isSelecting ? "none" : "auto",

                }}

            >

                {cards.map((card, i) => {

                    const angle = startAngle + angleIncrement * i;

                    const baseZ = total - i;

                    const theta = (angle * Math.PI) / 180;

                    const xOffset = Math.sin(theta) * radius;

                    const yOffset = -Math.cos(theta) * radius * 0.35;

                    const isGlowing = glowingCard === card.id;



                    return (

                        <motion.div

                            key={card.id}

                            onPointerUp={() => handleCardClick(card)}

                            className="absolute rounded-2xl shadow-2xl bg-white cursor-pointer flex items-center justify-center transition-transform hover:scale-110 hover:z-50"

                            style={{

                                width: cardWidth,

                                height: cardHeight,

                                transform: `translate(${xOffset}px, ${yOffset}px) rotate(${angle}deg)`,

                                transformOrigin: "center 170%",

                                zIndex: baseZ,

                                boxShadow: isGlowing

                                    ? "0 0 40px 15px rgba(255, 215, 0, 0.7)"

                                    : "0 6px 15px rgba(0,0,0,0.35)",

                            }}

                            transition={{ duration: 0.3, ease: "easeOut" }}

                        >

                            <img

                                src={back_of_card}

                                alt="Card back"

                                className="w-full h-full object-cover rounded-xl"

                            />

                        </motion.div>

                    );

                })}

            </div>



            {/* Card Details */}

            <AnimatePresence mode="wait">

                {selectedCard && (

                    <motion.div

                        ref={detailsRef}

                        key={selectedCard.id}

                        className="w-full px-3 sm:px-6 md:px-8 lg:px-10"

                        initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}

                        animate={{

                            opacity: fadeOut ? 0 : 1,

                            y: fadeOut ? 50 : 0,

                            filter: fadeOut ? "blur(6px)" : "blur(0px)",

                        }}

                        exit={{ opacity: 0, y: 50, filter: "blur(6px)" }}

                        transition={{ duration: 0.3, ease: "easeOut" }}

                    >

                        <CardDetail card={selectedCard} />

                    </motion.div>

                )}

            </AnimatePresence>

        </div>

    );

}

