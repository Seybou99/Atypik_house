'use client';

import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FieldValues, 
  SubmitHandler, 
  useForm
} from 'react-hook-form';
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation';
import { useMemo, useState } from "react";

import useRentModal from '@/app/hooks/useRentModal';

import Modal from "./Modal";
import { categories } from '../navbar/Categories';
import Heading from '../Heading';
import CategoryInput from '../Inputs/CategoryInput';
import CountrySelect from '../Inputs/CountrySelect';
import Counter from '../Inputs/Counter';
import ImageUpload from '../Inputs/ImageUpload';
import Input from '../Inputs/Input';

enum STEPS {
  CATEGORY = 0,
  LOCATION = 1,
  INFO = 2,
  IMAGES = 3,
  DESCRIPTION = 4,
  PRICE = 5,
}

const RentModal = () => {
  const router = useRouter();
  const rentModal = useRentModal();

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(STEPS.CATEGORY);

  const { 
    register, 
    handleSubmit,
    setValue,
    watch,
    formState: {
      errors,
    },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      category: '',
      location: null,
      guestCount: 1,
      roomCount: 1,
      bathroomCount: 1,
      imageSrc: '',
      price: 1,
      title: '',
      description: '',
    }
  });

  const location = watch('location');
  const category = watch('category');
  const guestCount = watch('guestCount');
  const roomCount = watch('roomCount');
  const bathroomCount = watch('bathroomCount');
  const imageSrc = watch('imageSrc');

  const Map = useMemo(() => dynamic(() => import('../Map'), { 
    ssr: false 
  }), [location]);


  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
  }

  const onBack = () => {
    setStep((value) => value - 1);
  }

  const onNext = () => {
    setStep((value) => value + 1);
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    if (step !== STEPS.PRICE) {
      return onNext();
    }
    
    setIsLoading(true);

    axios.post('/api/listings', data)
    .then(() => {
      toast.success('Logement enregistré');
      router.refresh();
      reset();
      setStep(STEPS.CATEGORY)
      rentModal.onClose();
    })
    .catch(() => {
      toast.error('Il y a eu un problème');
    })
    .finally(() => {
      setIsLoading(false);
    })
  }

  const actionLabel = useMemo(() => {
    if (step === STEPS.PRICE) {
      return 'Créer'
    }

    return 'Suivant'
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.CATEGORY) {
      return undefined
    }

    return 'Retour'
  }, [step]);

  let bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Quel type de logement avez-vous besoin de louer ?"
        subtitle="Choisissez une catégorie"
      />
      <div 
        className="
          grid 
          grid-cols-1 
          md:grid-cols-2 
          gap-3
          max-h-[50vh]
          overflow-y-auto
        "
      >
        {categories.map((item) => (
          <div key={item.label} className="col-span-1">
            <CategoryInput
              onClick={(category) => 
                setCustomValue('category', category)}
              selected={category === item.label}
              label={item.label}
              icon={item.icon}
            />
          </div>
        ))}
      </div>
    </div>
  )

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Quelle est votre localisation ?"
          subtitle="Choisissez une zone"
        />
        <CountrySelect 
          value={location} 
          onChange={(value) => setCustomValue('location', value)} 
        />
        <Map center={location?.latlng} />
      </div>
    );
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Quelque information sur votre logement ?"
          subtitle="Ces informations seront publiques"
        />
        <Counter 
          onChange={(value) => setCustomValue('guestCount', value)}
          value={guestCount}
          title="Nombre de chambres" 
          subtitle="Habitants dans votre logement"
        />
        <hr />
        <Counter 
          onChange={(value) => setCustomValue('roomCount', value)}
          value={roomCount}
          title="Nombre de pièces" 
          subtitle="combien de pièces dans votre logement"
        />
        <hr />
        <Counter 
          onChange={(value) => setCustomValue('bathroomCount', value)}
          value={bathroomCount}
          title="Nombre de salles de bains" 
          subtitle="combien de salles de bains dans votre logement"
        />
      </div>
    )
  }

  if (step === STEPS.IMAGES) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Ajoutez quelques images de votre logement"
          subtitle="Ces images seront visibles pour les autres utilisateurs"
        />
        <ImageUpload
          onChange={(value) => setCustomValue('imageSrc', value)}
          value={imageSrc}
        />
      </div>
    )
  }

  if (step === STEPS.DESCRIPTION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Comment décririez-vous votre logement ?"
          subtitle="Court et simple fonctionne le mieux !"
        />
        <Input
          id="title"
          label="Titre"
          disabled={isLoading}
          register={register}
          error={errors}
          required
        />
        <hr />
        <Input
          id="description"
          label="Description"
          disabled={isLoading}
          register={register}
          error={errors}
          required
        />
      </div>
    )
  }

  if (step === STEPS.PRICE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Quel est le prix de votre logement ?"
          subtitle="Ces informations seront visibles pour les autres utilisateurs"
        />
        <Input
          id="price"
          label="Prix"
          formatPrice 
          type="number" 
          disabled={isLoading}
          register={register}
          error={errors}
          required
        />
      </div>
    )
  }

  return (
    <Modal
      disabled={isLoading}
      isOpen={rentModal.isOpen}
      title="AtypikHouse - Louer "
      actionLabel={actionLabel}
      onSubmit={handleSubmit(onSubmit)}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.CATEGORY ? undefined : onBack}
      onClose={rentModal.onClose}
      body={bodyContent}
    />
  );
}

export default RentModal;
