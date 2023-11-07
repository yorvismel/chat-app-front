 import {
   faAddressBook,
   faAddressCard,
   faAngry,
   faArrowAltCircleDown,
   faBarChart,
   faBell,
   faBookmark,
   faCalendarMinus,
   faCheckCircle,
   faChessBishop,
   faCircleDown,
   faGem,
   faHand,
   faHeart,
   faSmile,
   faStar,
   faUser,
 } from "@fortawesome/free-regular-svg-icons";

 export const getRandomIcon = () => {
   const icons = [
     faStar,
     faUser,
     faSmile,
     faHeart,
     faBell,
     faAddressBook,
     faAngry,
     faAddressCard,
     faArrowAltCircleDown,
     faBarChart,
     faBookmark,
     faCalendarMinus,
     faChessBishop,
     faCheckCircle,
     faHand,
     faGem,
     faCircleDown,
   ]; // Iconos de react-icons
   const randomIcon = icons[Math.floor(Math.random() * icons.length)];
   return randomIcon;
 };
