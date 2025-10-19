import { useState } from "react";
import cardsData from "../data/cards.json"; // adjust path

export default function CardDetail({ card, onBack }) {

    return (

        <div className="text-center mt-10 py-20">
            {card && (
                <div className="mt-6">
                    <img
                        src={card.image}
                        alt={card.name}
                        className="mx-auto w-48 h-48 object-cover rounded-lg shadow-md"
                    />
                    <h2 className="text-2xl font-bold mt-4">{card.name}</h2>
                    <p className="mt-2 text-gray-700">{card.interpretation}</p>
                </div>
            )}

            <button
                onClick={onBack}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Back
            </button>
        </div>
    );
}