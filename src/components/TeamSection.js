import teamData from "../data/team.json";

export default function TeamSection() {
    return (
        <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Team</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {teamData.map((member, idx) => (
                    <div
                        key={idx}
                        className="bg-gray-100 p-4 rounded-lg text-center shadow hover:shadow-lg transition"
                    >
                        <img
                            src={member.photo}
                            alt={member.name}
                            className="w-24 h-24 mx-auto rounded-full object-cover"
                        />
                        <h3 className="mt-2 font-semibold">{member.name}</h3>
                        <p className="text-gray-600">
                            {member.major}
                        </p>

                        {/* LinkedIn Button — moved inside the loop */}
                        {member.linkedin && (
                            <a
                                href={member.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-all"
                            >
                                LinkedIn
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}