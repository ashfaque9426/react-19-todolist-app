import { useNavigate } from "react-router";
import cn from "../lib/clsx";

function NavigateButton({ children, navigateTo, btnStyles }: { children: React.ReactNode, navigateTo: string, btnStyles?: string }) {
    const navigate = useNavigate();
    return (
        <button className={cn("btn-primary", btnStyles)} onClick={() => navigate(navigateTo)}>{children}</button>
    )
}

export default NavigateButton;