import teamData from "../data/team.json";
import { FaLinkedin } from "react-icons/fa";

export default function TeamSection() {
    return (
        <section
            className="py-12 bg-white bg-cover bg-center"
            style={{ backgroundImage: "url('/design/team.png')" }}
        >
            <h2 className="font-welcome font-semibold text-[3rem] mb-10 text-center text-[#e9d8a0]">
                Meet The Team
            </h2>

            <div
                className="grid gap-8 px-4 md:px-16 justify-center"
                style={{
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gridAutoRows: "1fr",
                }}
            >
                {teamData.map((member, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col p-6 rounded-2xl bg-white text-center shadow-md hover:shadow-xl hover:scale-105 transform transition-all duration-300"
                    >
                        <img
                            src={member.photo}
                            alt={member.name}
                            className="w-28 h-28 mx-auto rounded-xl object-cover border-2 shadow-sm"
                            style={{ borderColor: "#01051a" }}
                        />

                        <h3 className="font-welcome mt-4 tracking-wide text-2xl" style={{ color: "#01051a" }}>
                            {member.name}
                        </h3>

                        <p className="font-GIR mt-1 text-base" style={{ color: "#01051a" }}>
                            {member.major}
                        </p>

                        <div className="mt-auto">
                            {member.linkedin && (
                                <a
                                    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-GIR inline-flex items-center mt-3 px-3 py-1.5 rounded-full text-sm text-white font-medium transition-all hover:opacity-90"
                                    style={{ backgroundColor: "#01051a" }}
                                    onMouseOver={e => {
                                        e.currentTarget.style.backgroundColor = "#e9d8a0";
                                        e.currentTarget.style.color = "#01051a";
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.backgroundColor = "#01051a";
                                        e.currentTarget.style.color = "#fff";
                                    }}
                                >
                                    <FaLinkedin className="mr-2" size={22} /> LinkedIn
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
