import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const handleInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Define un middleware para manejar errores de validación.

  // Almacena los resultados de la validación =>en "errors".
  const errors = validationResult(req); //------- SUGERIDO POR CHATGPT

  //errores no está vacía
  if (!errors.isEmpty()) {
    // Devuelve la lista de errores en formato JSON.
    res.status(400).json({
      errors: errors.array(),
    });
    return;//------- SUGERIDO POR CHATGPT
  }

  next();
  // Si no hay errores, pasa el control al siguiente middleware o manejador.
};
