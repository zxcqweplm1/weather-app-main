import logo from "../assets/images/logo.svg";
import type { HeaderProps } from "../types/types";

const Header: React.FC<HeaderProps> = ({unit, setUnit}) => {
    const handleUnits = (e: any) => {
      if(setUnit)
    setUnit(e.target.value);
  }
  return (
    <div className="px-3 py-5 flex flex-row items-center justify-between">
        <a href="#">
        <img src={logo} alt="logo" className="w-35"/>
        </a>
        <select 
        className="p-2 rounded-lg bg-neutral-800 font-semibold" 
        value={unit}
        onChange={handleUnits}
        >
            <option value="Metric">Metric</option>
            <option value="Imperial">Imperial</option>
        </select>
    </div>
  )
}

export default Header