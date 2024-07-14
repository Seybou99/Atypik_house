'use client';
import { useEffect, useState } from "react";

interface ClientOnlyProps {
    children: React.ReactNode;
}
const ClientOnly: React.FC<ClientOnlyProps> = ({children}) => {
    const [hasMouted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);
    if(!hasMouted) {
        return null;}
    return (
        <>
         {children}
        </>
    );
}
export default ClientOnly