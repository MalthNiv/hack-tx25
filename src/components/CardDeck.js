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
    const spread = 80;
    const startAngle = -spread / 2;
    const angleIncrement = total > 1 ? spread / (total - 1) : 0;
    const back_of_card = "/design/back-of-card.png";

    // Responsive card size
    const getCardSize = () => {
        if (typeof window === "undefined") return { width: 220, height: 293 };
        const baseWidth = 1920; // design reference width
        const scaleFactor = Math.min(window.innerWidth / baseWidth, 1); // never go bigger than design
        const width = Math.max(Math.min(288 * scaleFactor, 288), 180); // min 180, max 288
        return { width, height: width * 4 / 3 };
    };
    const { width: cardWidth, height: cardHeight } = getCardSize();

    // Responsive radius
    const getRadius = () => {
        const minRadius = 180;  // smallest spread
        const maxRadius = 300;  // largest spread
        const baseWidth = 1440; // design width reference

        if (typeof window === "undefined") return maxRadius;

        let scale = window.innerWidth / baseWidth;
        scale = Math.min(scale, 1);   // cap max
        scale = Math.max(scale, 0.5); // cap min

        return minRadius + (maxRadius - minRadius) * scale;
    };
    const radius = getRadius();

    const handleCardClick = useCallback(
        (clickedCard) => {
            if (isSelecting) return;
            setIsSelecting(true);

            if (fadeOutTimeoutRef.current) {
                clearTimeout(fadeOutTimeoutRef.current);
                fadeOutTimeoutRef.current = null;
            }

            setGlowingCard(clickedCard.id);

            if (cards.length > 0) {
                const randomIndex = Math.floor(Math.random() * cards.length);
                const randomCard = cards[randomIndex];
                setSelectedCard({ ...randomCard });
            }

            setFadeOut(false);
            setTimeout(() => setIsSelecting(false), 700);
        },
        [isSelecting, cards]
    );

    // Auto-scroll to the top of the deck
    useEffect(() => {
        if (!selectedCard || !deckRef.current) return;
        setIsAutoScrolling(true);

        const targetPosition =
              detailsRef.current.offsetTop + detailsRef.current.offsetHeight - window.innerHeight;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = 600;
        let startTime = null;

        const animateScroll = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease =
                progress < 0.5
                    ? 2 * progress * progress
                    : -1 + (4 - 2 * progress) * progress;

            window.scrollTo(0, startPosition + distance * ease);
            if (elapsed < duration) requestAnimationFrame(animateScroll);
            else setIsAutoScrolling(false);
        };

        requestAnimationFrame(animateScroll);
    }, [selectedCard]);

    // Fade out details if scrolled above deck
    useEffect(() => {
        let debounceTimeout;
        const handleScroll = () => {
            if (isAutoScrolling) return;
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                if (!deckRef.current) return;
                const deckTop =
                    deckRef.current.getBoundingClientRect().top + window.scrollY;
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

    // Dynamic deck height for small screens
    const getDeckHeight = () => {
        if (typeof window === "undefined") return 700;
        return Math.max(window.innerHeight * 0.6, 400); // min 400px, 60% of viewport
    };

    const deckHeight = getDeckHeight();

    return (
        <div className="flex flex-col items-center space-y-8">
            {/* Card deck */}
            <div
                ref={deckRef}
                className="relative w-full flex items-center justify-center bg-[url('/design/page_design_2.png')] bg-cover bg-center overflow-visible"
                style={{ height: deckHeight, pointerEvents: isSelecting ? "none" : "auto" }}
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

            {/* Card details */}
            <AnimatePresence mode="wait">
                {selectedCard && (
                    <motion.div
                        ref={detailsRef}
                        key={selectedCard.id}
                        className="w-full px-4 sm:px-6 md:px-8 lg:px-10"
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
