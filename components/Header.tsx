"use client";

import Image from "next/image";
import React from "react";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import useBoardStore from "@/store/boardStore";

const Header = () => {
  const { searchString, setSearchString } = useBoardStore();

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center  p-5 bg-gray-500/10">
        <div
          className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-[#0055D1]
          rounded-md
          filter blur-3xl opacity-50 -z-50"
        />
        <Image
          src="https://links.papareact.com/c2cdd5"
          alt="trello logo"
          width={300}
          height={100}
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain flex-1 "
        />
        <div className="flex items-center space-x-5 justify-end w-full">
          {/* sEARCHBAR */}
          <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial ">
            <MagnifyingGlassIcon className="h-6 w-6 text-gray-100" />
            <input
              type="text"
              className="flex-1 outline-none"
              placeholder="Search"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            ></input>
            <button type="submit" hidden>
              Search
            </button>
          </form>
          {/* AVATAR */}
          <div className="flex justify-center items-center  bg-blue-600  w-10 h-10 rounded">
            <h5 className="decoration-red text-white ">KP</h5>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center px-5 py-2 md:py-5">
        <p className="flex items-center p-5 font-light  text-sm rounded-xl w-fit shadow-xl bg-white italic max-w-3xl text-[#0055D1]">
          <UserCircleIcon className="inline-block h-10 w-10 text-[#0055D1]" />
          GPT is summerising your task for the day...
        </p>
      </div>
    </header>
  );
};

export default Header;
