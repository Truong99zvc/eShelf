import React from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiOutlineWechat,
  AiFillYoutube,
  AiFillGithub,
} from "react-icons/ai";

const Footer = () => {
  return (
    <footer className="border-t border-gray-300 text-gray-400">
      <div className="grid grid-cols-3 overflow-hidden py-4 text-center text-sm">
        <span className="cursor-pointer select-none">© 2024 eShelf.</span>
        <span className="cursor-pointer select-none">
          Điều khoản · Chính sách
        </span>
        <span className="relative -right-24 -top-1 flex gap-4">
          <AiFillFacebook
            className="cursor-pointer hover:text-gray-500"
            size={24}
            title="Facebook"
          />
          <AiFillInstagram
            className="cursor-pointer hover:text-gray-500"
            size={24}
            title="Instagram"
          />
          <AiOutlineWechat
            className="cursor-pointer hover:text-gray-500"
            size={24}
            title="WeChat"
          />
          <AiFillYoutube
            className="cursor-pointer hover:text-gray-500"
            size={24}
            title="YouTube"
          />
          <a href="https://github.com/levanvux/eShelf" target="_blank">
            <AiFillGithub
              className="hover:text-gray-500"
              size={24}
              title="GitHub"
            />
          </a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
