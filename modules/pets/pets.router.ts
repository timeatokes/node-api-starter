import { Router, Request, Response } from "express";
import PetsController from "./pets.controller";

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    const { statusCode, body } = await PetsController.getPets(req);
    res.status(statusCode).send(body);
  });
  
  router.get('/:petId', async (req: Request, res: Response) => {
    const { petId } = req.params;
    const { statusCode, body } = await PetsController.getPetById(req, petId);
    res.status(statusCode).send(body);
  });
  
  router.post('/', async (req: Request, res: Response) => {
    const { statusCode, body } = await PetsController.addNewPet(req, req.body);
    res.status(statusCode).send(body);
  });

  router.delete('/:petId', async (req: Request, res: Response) => {
    const { petId } = req.params;
    const { statusCode, body } = await PetsController.deletePet(req, petId);
    res.status(statusCode).send(body);
  });

  router.put('/:petId', async (req: Request, res: Response) => {
    const { petId } = req.params;
    const { statusCode, body } = await PetsController.updatePet(req, petId, req.body);
    res.status(statusCode).send(body);
  });
  
  export default router
