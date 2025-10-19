import { motion } from "framer-motion";
import React from 'react';


export default function CardDeck({ cards, onSelect }) {
    const total = cards.length;
    const spread = 80;
    const radius = 200; // amount of outward translation in px (or other units)
    const startAngle = -spread / 2;
    const angleIncrement = spread / (total - 1);

    return (
        <div className="relative w-full h-96 flex items-center justify-center">
            {cards.map((card, i) => {
                const angle = startAngle + (angleIncrement * i);
                const baseZ = total - i;  // highest z for last card
                const theta = (angle * Math.PI) / 180;  // convert angle
                const xOffset = Math.sin(theta) * radius;
                const yOffset = -Math.cos(theta) * (radius * 0.3); // optional vertical shift
                return (
                    <motion.div
                        key={card.id}
                        className={`absolute w-64 h-80 bg-white rounded-2xl shadow-xl p-6 transition-transform transform hover:scale-110 hover:z-50`}
                        onClick={() => onSelect(card)}
                        style={{
                            transform: `translate(${xOffset}px, ${yOffset}px) rotate(${angle}deg)`,
                            transformOrigin: 'center 165%',
                            zIndex: baseZ
                        }}
                    >
                        <img src={card.image} alt={card.title} />
                    </motion.div>
                );
            })}
        </div>
    );
}

