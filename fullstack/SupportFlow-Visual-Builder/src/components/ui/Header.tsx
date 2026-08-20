import { useState } from "react";
import { NavLink } from "react-router";
function Header() {

    const [param , setParam] = useState('')

    function changePath(){
        setParam(param === "/preview" ? "preview" : "")
    }

return (
        <>
            <header className="bg-[#FF9D42] w-full flex place-content-between px-20 py-4 items-center text-white">
                <h1 className="font-bold">SUPPORT FLOW</h1>
                <NavLink to={location.pathname === "/preview" ? "/" : "preview"}>
                    <button className="bg-white cursor-pointer flex items-center text-[#FF9D42] rounded-lg p-2" onClick={changePath}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                            <path d="M10.7097 5.57897L3.11133e-05 10.6908L0.315939 1.38079e-07L10.7097 5.57897Z" fill="#FF9D42" fill-opacity="0.78" />
                        </svg>
                        <h1 className="text-primary">{location.pathname === "/preview" ? "Editor" : "preview"}</h1>
                    </button>
                </NavLink>

            </header>
        </>
    )
}

export default Header;