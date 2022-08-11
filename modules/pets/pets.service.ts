import { ControllerError, ControllerResponse, ResponseFactory } from "../../toolkit";
import PetsDal from "./pets.dal";
import { NewPetModel, PetModel } from "./pets.models";

export default class PetsService {
    public static async getAllPets(): Promise<ControllerResponse<PetModel[] | ControllerError>> {
        const users = await PetsDal.getAllPets();

        return ResponseFactory.createResponse(users);
    }

    public static async getPetById(petId: string): Promise<ControllerResponse<PetModel | ControllerError>> {
        const pet = await PetsDal.getPetById(petId);

        if (!pet) {
          return ResponseFactory.createNotFoundError();
        }
    
        return ResponseFactory.createResponse(pet);
    }

    public static async addNewPet(petData: NewPetModel): Promise<ControllerResponse<PetModel | ControllerError>> {  
        const newPet = await PetsDal.addNewPet({ ...petData });
    
        if (newPet) {
          return ResponseFactory.createResponse(newPet);
        }
    
        return ResponseFactory.createInternalServerError();
    }

    public static async deletePet(petId: string): Promise<ControllerResponse<null>> {
        await PetsDal.deletePet(petId);
        return ResponseFactory.createResponse(null);
    }

    public static async updatePet(petId: string, newPetData: NewPetModel): Promise<ControllerResponse<PetModel>> {
        const updatedPet = await PetsDal.updatePet(petId, newPetData);

        return ResponseFactory.createResponse(updatedPet);
    }
}