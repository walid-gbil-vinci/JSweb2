import { useState } from "react";
import "./Header.css";

interface HeaderProps {
  title: string;
  version: number;
}


const Header = ({ title, version }: HeaderProps) => {
  const [menuPrinted, setMenuPrinted] = useState(false);

    const handleClick = () => {
    console.log(`value of menuPrinted before click: ${menuPrinted}`);
    setMenuPrinted(!menuPrinted);
  }

  return (
    //Lorsque le <header> est cliqué, la fonction bascule l'état menuPrinted en appelant setMenuPrinted(!menuPrinted) : si menuPrinted est à false, sa valeur est changée vers true, et vice versa.
    <header onClick={handleClick}>//initialise une variable d'état menuPrinted avec une valeur initiale de false
      <h1 className="animate__animated animate__bounce">{title}</h1>
      {menuPrinted ? `${title}... and rarely do we hate it!` : title}
      <h4>Version: {version}</h4>
    </header>
  );
};
export default Header;
