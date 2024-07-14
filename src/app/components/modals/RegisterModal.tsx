'use client';

import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../Inputs/Input";
import toast, { Toaster } from "react-hot-toast";
import Button from "../Button";
import { signIn } from "next-auth/react";
import LoginModal from "./LoginModal";
import useLoginModal from "@/app/hooks/useLoginModal";
const RegisterModal = () => {
    const registerModal = useRegisterModal();
    
  const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        axios.post('/api/register', data).then(() => {
            toast.success('Inscription réussie');
            registerModal.onClose();
            loginModal.onOpen();
        })
        .catch((error) => {
            toast.error('Il y a eu un problème');
        })
        .finally(() => {
            setIsLoading(false);
        })
    }
    const onToggle = useCallback(() => {
        loginModal.onClose();
        registerModal.onOpen();
      }, [loginModal, registerModal])
   
    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading 
            title="Bienvenu sur Atipyk house" subtitle="Creer votre compte"/>
            <Input 
            id="email" 
            label="Email" 
            disabled={isLoading} 
            register={register} 
            error={errors} 
            required
            />
            
            <Input 
            id="name" 
            label="Nom" 
            disabled={isLoading} 
            register={register} 
            error={errors} 
            required
            />
            
            <Input 
            id="password" 
            type="password"
            label="Mot de passe" 
            disabled={isLoading} 
            register={register} 
            error={errors} 
            required
            />
        </div>
        
    );
    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />
            <Button outline label="Continuer avec Google" icon={FcGoogle} onClick={() => signIn('google')}/>
            <Button outline label="Continuer avec Github" icon={AiFillGithub} onClick={() => signIn('github')}/>
            <div className="text-neutral-500 text-center mt-4 font-light">
                <div className="justify-center flex flex-row items-center gap-2">
                    <div>Vous avez déja un compte ?</div>
                    <div onClick={onToggle} className="text-neutral-800 cursor-pointer hover:underline">Se connecter</div>
                </div>
            </div>
        </div>
    )
    return (
        <Modal disabled={isLoading} 
        isOpen={registerModal.isOpen} 
        title="Inscription" 
        actionLabel="Continuer" 
        onClose={registerModal.onClose} 
        onSubmit={handleSubmit(onSubmit)}
        body={bodyContent}
        footer={footerContent} 
        />
    );
}
export default RegisterModal;