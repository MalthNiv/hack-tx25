import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CardDetail from "./CardDetail";

export default function CardDeck({ cards }) {
    const [selectedCard, setSelectedCard] = useState(null);

    const total = cards.length;
    const spread = 80;
    const radius = 230;
    const startAngle = -spread / 2;
    const angleIncrement = spread / (total - 1);
    const back_of_card = "/design/back-of-card.png";

    return (
        <div className="flex flex-col items-center space-y-8">
            {/* Fanned Deck */}
            <div className="relative w-full h-150 flex items-center justify-center bg-[url('/design/page_design_2.png')] bg-cover bg-center overflow-visible">
                {cards.map((card, i) => {
                    const angle = startAngle + angleIncrement * i;
                    const baseZ = total - i;
                    const theta = (angle * Math.PI) / 180;
                    const xOffset = Math.sin(theta) * radius;
                    const yOffset = -Math.cos(theta) * (radius * 0.3);
                    const isSelected = selectedCard?.id === card.id;

                    return (
                        <motion.div
                            key={card.id}
                            onClick={() => setSelectedCard(card)}
                            className="absolute w-64 h-80 rounded-2xl shadow-xl bg-white cursor-pointer flex items-center justify-center transition-transform hover:scale-105 hover:z-50"
                            style={{
                                transform: `translate(${xOffset}px, ${yOffset}px) rotate(${angle}deg)`,
                                transformOrigin: "center 170%",
                                zIndex: baseZ,
                            }}
                            animate={{
                                boxShadow: isSelected
                                    ? "0 0 30px 8px rgba(255, 215, 0, 0.6)" // glowing gold
                                    : "0 4px 10px rgba(0,0,0,0.3)", // normal shadow
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

            {/* Animated Card Details below */}
            <AnimatePresence mode="wait">
                {selectedCard && (
                    <motion.div
                        key={selectedCard.id}
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
