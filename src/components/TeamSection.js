import teamData from "../data/team.json";
import { FaLinkedin } from "react-icons/fa";

export default function TeamSection() {
    return (
        <section className="mt-20 py-12 bg-gradient-to-r from-purple-50 to-blue-50">
            <h2 className="font-welcome font-semibold text-[3rem] font-bold mb-10 text-center text-gray-800">
                Meet The Team
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-4 md:px-16">
                {teamData.map((member, idx) => (
                    <div
                        key={idx}
                        className="p-6 rounded-2xl bg-white text-center shadow-md hover:shadow-xl hover:scale-105 transform transition-all duration-300"
                    >
                        {/* Profile photo as rounded square */}
                        <img
                            src={member.photo}
                            alt={member.name}
                            className="w-28 h-28 mx-auto tracking-wide rounded-xl object-cover border-3 shadow-sm"
                            style={{ borderColor: "#01051a" }}
                        />

                        {/* Name */}
                        <h3 className="font-welcome mt-4 tracking-wide text-2xl text-#01051a">
                            {member.name}
                        </h3>

                        {/* Major */}
                        <p className="text-#01051a mt-1 text-m">{member.major}</p>

                        {/* LinkedIn */}
                        {member.linkedin && (
                            <a
                                href={member.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center mt-3 px-3 py-1.5 rounded-full text-sm text-white font-medium transition-all hover:opacity-90 bg-[#01051a] transition-colors duration-300 hover:bg-[#e9d8a0] hover:text-[#01051a]"
                            >
                                <FaLinkedin className="mr-2" size={22} /> LinkedIn
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );

}