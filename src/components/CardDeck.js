import { motion } from "framer-motion"; 

export default function CardDeck({ cards, onSelect }) { 
    return (
    <div className="flex overflow-x-scroll space-x-4 p-4"> 
    {cards.map((card) => (
        <motion.div 
        key={card.id} 
        whileHover={{ scale: 1.1 }} 
        className="bg-gray-100 w-48 h-64 flex-shrink-0 cursor-pointer rounded-xl shadow-lg flex items-center justify-center" 
        onClick={() => onSelect(card)} 
        > 
        <img src={card.image} className="w-32 h-32 object-cover rounded-lg" /> 
        </motion.div>
        ))} 
        </div>
        ); 
    }