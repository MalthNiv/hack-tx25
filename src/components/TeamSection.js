import teamData from "../data/team.json"; 

export default function TeamSection() { 
    return (
    <div className="mt-16"> 
    <h2 className="text-2xl font-bold mb-6">Our Team</h2> 
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6"> 
        {teamData.map((member, idx) => (
            <div key={idx} className="bg-gray-100 p-4 rounded-lg text-center shadow"> 
            <img src={member.photo} className="w-24 h-24 mx-auto rounded-full" /> 
            <h3 className="mt-2 font-semibold">{member.name}</h3> 
            <p className="text-gray-600">{member.major}, {member.year}</p> 
            <p className="mt-1 text-sm text-gray-500">{member.tech.join(", ")}</p> </div>
            ))} 
    </div> 
    </div>
    ); 
}