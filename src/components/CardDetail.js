export default function CardDetail({ card, onBack }) 
{ return (<div className="text-center mt-10"> 
<button 
onClick={onBack} 
className="mb-4 px-4 py-2 bg-blue-500 text-white rounded" 
> 
Back 
</button> 
<img src={card.image} className="mx-auto w-48 h-48 object-cover rounded-lg" /> 
<h2 className="text-2xl font-bold mt-4">{card.name}</h2> 
<p className="mt-2 text-gray-700">{card.interpretation}</p> </div>
); 
}