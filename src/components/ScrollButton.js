import React from "react";



export default function ScrollButton() {

    const handleClick = () => {

        const section = document.getElementById("card-deck");

        if (section) section.scrollIntoView({ behavior: "smooth" }) - 20;

    };



    return (

        <button

            onClick={handleClick}

            className="absolute animate-bounce hover:scale-110 transition-transform"

            style={{

                right: "29.1667%",

                bottom: "55px",

                width: "115px",

                height: "115px",

                zIndex: 50,

            }}

            title="Scroll Down"

        >

            <img

                src="/design/scroll-down.png"

                alt="Scroll Down"

                className="w-full h-full object-contain"

            />

        </button>

    );

}