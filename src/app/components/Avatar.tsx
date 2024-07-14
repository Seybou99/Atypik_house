'use client';
import Image from 'next/image';

interface AvatarProps {
  src: string | null | undefined;
}
const Avatar: React.FC<AvatarProps> = ({src}) => {
  return (
    <Image  className="rounded-full cursor-pointer" src= {src || "/images/placeholder.jpg"} alt="Avatar" width="30" height="30"/>
)
}
export default Avatar