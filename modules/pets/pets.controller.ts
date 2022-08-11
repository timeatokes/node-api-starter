import { Request, Response, Get, Route, Tags, Path, Post, Body, Delete, Put } from "tsoa";
import { ControllerError, controllerExceptionHandler, ControllerResponse, ErrorMessageCode, ExceptionSafe } from "../../toolkit";
import { Request as ExpressRequest } from 'express';
import { NewPetModel, PetModel } from "./pets.models";
import PetsService from "./pets.service";

@Tags('Pets')
@Route('pets')
@ExceptionSafe(controllerExceptionHandler)
export default class PetsController {
    @Get('/')
    @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(500, 'Internal server error')
    public static async getPets(@Request() _request: ExpressRequest): Promise<ControllerResponse<PetModel[] | ControllerError>> {
        return await PetsService.getAllPets();
    }

    @Get('/{petId}')
    @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(500, 'Internal server error')
    @Response<{ message: ErrorMessageCode.NOT_FOUND }>(404, 'Not found')
    public static async getPetById(@Request() _request: ExpressRequest, @Path() petId: string): Promise<ControllerResponse<PetModel | ControllerError>> {
        return await PetsService.getPetById(petId);
    }

    @Post('/')
    @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(500, 'Internal server error')
    @Response<{ message: ErrorMessageCode.BAD_REQUEST }>(400, 'Bad request')
    public static async addNewPet(@Request() _request: ExpressRequest, @Body() petData: NewPetModel): Promise<ControllerResponse<PetModel | ControllerError>> {
        return await PetsService.addNewPet(petData);
    }

    @Delete('/{petId}')
    @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(500, 'Internal server error')
    public static async deletePet(@Request() _request: ExpressRequest, @Path() petId: string): Promise<ControllerResponse<null | ControllerError>> {
        return await PetsService.deletePet(petId);
    }

    @Put('/{petId}')
    @Response<{ message: ErrorMessageCode.INTERNAL_SERVER_ERROR }>(500, 'Internal server error')
    public static async updatePet(@Request() _request: ExpressRequest, @Path() petId: string, @Body() petData: NewPetModel): Promise<ControllerResponse<PetModel | ControllerError>> {
        return await PetsService.updatePet(petId, petData);
    }
}