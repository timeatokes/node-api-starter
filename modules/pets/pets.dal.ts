import crypto from "crypto";
import { PetModel, NewPetModel } from "./pets.models";
import { ExceptionSafe, dalExceptionHandler } from "../../toolkit";

const Pets : PetModel[] = [];

@ExceptionSafe(dalExceptionHandler)
export default class PetsDal {
    public static getAllPets(): PetModel[] {
       return Pets;
    }

    public static getPetById(petId: string): PetModel | null {
        return Pets.find((pet) => pet.id === petId) || null;
    }

    public static addNewPet(petData: NewPetModel): PetModel {
        const newPet: PetModel = { ...petData, id: crypto.randomUUID() };
    
        Pets.push(newPet);
        return newPet;
    }

    public static deletePet(petId: string) {
        const petIndex: number = Pets.findIndex((pet) => pet.id === petId);

        if (petIndex !== -1) {
            Pets.splice(petIndex, 1);
        }
    }

    public static updatePet(petId: string, newPetData: NewPetModel): PetModel {
        const petIndex: number = Pets.findIndex((pet) => pet.id === petId);
        let updatedPet: PetModel;

        if (petIndex === -1) {
            updatedPet = { ...newPetData, id: crypto.randomUUID() };
            Pets.push(updatedPet);
        } else {
            updatedPet = { ...newPetData, id: petId};
        }

        Pets[petIndex] = updatedPet;

        return updatedPet;
    }
}