import { exit } from "node:process";
import db from "../config/db";

//LIMPIAR BASE DE DATOS
const clearDB = async () => {
  try {
    await db.sync({ force: true });
    console.log("Datos eliminados correctamente");
    exit(0); //* 0 => Finaliza el programa BIEN
  } catch (error) {
    console.log(error);
    exit(1); //* 1 => Finaliza CON ERRORES
  }
};

if (process.argv[2] === "--clear") {
  clearDB();
}

// console.log(process.argv);
