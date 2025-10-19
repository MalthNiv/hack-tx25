import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CardDetail from "./CardDetail";

export default function CardDeck({ cards }) {
    // Ensure cards is always an array
    const safeCards = Array.isArray(cards) ? cards : [];

    const [selectedCard, setSelectedCard] = useState(null);
    const [glowingCard, setGlowingCard] = useState(null);
    const deckRef = useRef(null);
    const detailsRef = useRef(null);

    const total = safeCards.length;
    const spread = 80;
    const radius = 230;
    const startAngle = -spread / 2;
    const angleIncrement = total > 1 ? spread / (total - 1) : 0;
    const back_of_card = "/design/back-of-card.png";

    const handleCardClick = (card) => {
        setSelectedCard(card);
        setGlowingCard(card.id);

        // Glow fades out automatically after 1.2s
        setTimeout(() => setGlowingCard(null), 1200);
    };

    // Scroll to details when a card is selected
    useEffect(() => {
        if (selectedCard && detailsRef.current) {
            const targetPosition =
                detailsRef.current.getBoundingClientRect().top + window.scrollY;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth",
            });
        }
    }, [selectedCard]);

    // Hide details and glow if scrolling back above the deck
    useEffect(() => {
        const handleScroll = () => {
            if (!deckRef.current) return;

            const deckTop = deckRef.current.getBoundingClientRect().top + window.scrollY;
            const scrollY = window.scrollY;

            if (selectedCard && scrollY < deckTop) {
                setSelectedCard(null);
                setGlowingCard(null);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [selectedCard]);

    return (
        <div className="flex flex-col items-center space-y-8">
            {/* Fanned Deck */}
            <div
                ref={deckRef}
                className="relative w-full h-150 flex items-center justify-center bg-[url('/design/page_design_2.png')] bg-cover bg-center overflow-visible"
            >
                {safeCards.map((card, i) => {
                    const angle = startAngle + angleIncrement * i;
                    const baseZ = total - i;
                    const theta = (angle * Math.PI) / 180;
                    const xOffset = Math.sin(theta) * radius;
                    const yOffset = -Math.cos(theta) * (radius * 0.3);
                    const isGlowing = glowingCard === card.id;

                    return (
                        <motion.div
                            key={card.id}
                            onClick={() => handleCardClick(card)}
                            className="absolute w-64 h-80 rounded-2xl shadow-xl bg-white cursor-pointer flex items-center justify-center transition-transform hover:scale-105 hover:z-50"
                            style={{
                                transform: `translate(${xOffset}px, ${yOffset}px) rotate(${angle}deg)`,
                                transformOrigin: "center 170%",
                                zIndex: baseZ,
                            }}
                            animate={{
                                boxShadow: isGlowing
                                    ? "0 0 35px 10px rgba(255, 215, 0, 0.7)" // glowing gold
                                    : "0 4px 10px rgba(0,0,0,0.3)",          // normal shadow
                            }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
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

            {/* Animated Card Details below */}
            <AnimatePresence mode="wait">
                {selectedCard && (
                    <motion.div
                        key={selectedCard.id}
                        ref={detailsRef}
                        className="w-full max-w-xl"
                        initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 50, filter: "blur(6px)" }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <CardDetail
                            card={selectedCard}
                            onBack={() => setSelectedCard(null)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
