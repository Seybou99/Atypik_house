'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { TbBeach, TbMountain, TbPool } from 'react-icons/tb';
import { 
  GiBarn, 
  GiBoatFishing, 
  GiCactus, 
  GiCastle, 
  GiCaveEntrance, 
  GiForestCamp, 
  GiIsland,
  GiWindmill
} from 'react-icons/gi';
import { FaSkiing } from 'react-icons/fa';
import { BsSnow } from 'react-icons/bs';
import { IoDiamond } from 'react-icons/io5';
import { MdOutlineVilla } from 'react-icons/md';

import CategoryBox from "../CategoryBox";
import Container from '../Container';


export const categories = [
  {
    label: 'Plage',
    icon: TbBeach,
    description: 'Cette propriété est proche de la plage!',
  },
  {
    label: 'Moulins à vent',
    icon: GiWindmill,
    description: 'Cette propriété a des moulins à vent!',
  },
  {
    label: 'Moderne',
    icon: MdOutlineVilla,
    description: 'Cette propriété est moderne!'
  },
  {
    label: 'Campagne',
    icon: TbMountain,
    description: 'Cette propriété est à la campagne!'
  },
  {
    label: 'Piscines',
    icon: TbPool,
    description: 'Cette propriété a une belle piscine!'
  },
  {
    label: 'Îles',
    icon: GiIsland,
    description: 'Cette propriété est sur une île!'
  },
  {
    label: 'Lac',
    icon: GiBoatFishing,
    description: 'Cette propriété est près d’un lac!'
  },
  {
    label: 'Ski',
    icon: FaSkiing,
    description: 'Cette propriété propose des activités de ski!'
  },
  {
    label: 'Châteaux',
    icon: GiCastle,
    description: 'Cette propriété est un ancien château!'
  },
  {
    label: 'Grottes',
    icon: GiCaveEntrance,
    description: 'Cette propriété est dans une grotte effrayante!'
  },
  {
    label: 'Camping',
    icon: GiForestCamp,
    description: 'Cette propriété propose des activités de camping!'
  },
  {
    label: 'Arctique',
    icon: BsSnow,
    description: 'Cette propriété est dans un environnement arctique!'
  },
  {
    label: 'Désert',
    icon: GiCactus,
    description: 'Cette propriété est dans le désert!'
  },
  {
    label: 'Granges',
    icon: GiBarn,
    description: 'Cette propriété est dans une grange!'
  },
  {
    label: 'Luxueux',
    icon: IoDiamond,
    description: 'Cette propriété est neuve et luxueuse!'
  }
]

const Categories = () => {
  const params = useSearchParams();
  const category = params?.get('category');
  const pathname = usePathname();
  const isMainPage = pathname === '/';

  if (!isMainPage) {
    return null;
  }

  return (
    <Container>
      <div
        className="
          pt-4
          flex 
          flex-row 
          items-center 
          justify-between
          overflow-x-auto
        "
      >
        {categories.map((item) => (
          <CategoryBox 
            key={item.label}
            label={item.label}
            icon={item.icon}
            selected={category === item.label}
          />
        ))}
      </div>
    </Container>
  );
}
 
export default Categories;