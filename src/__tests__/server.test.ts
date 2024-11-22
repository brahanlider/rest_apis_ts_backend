// import request from "supertest";
// import server, { connectDB } from "../server";
import { connectDB } from "../server";
import db from "../config/db";

// describe("GET /api", () => {
////  test("should send back a json response", async () => {
////    const res = await request(server).get("/api");

////    expect(res.status).toBe(200);
////    expect(res.header["content-type"]).toMatch(/json/);
////    expect(res.body.msg).toBe("Desde API");

////    lo que no se debe  esperar
////    expect(res.status).not.toBe(404);
////    expect(res.body.msg).not.toBe("desde api");
////  });
////});

// importamos un mock simula una accion = bd
jest.mock("../config/db");

describe("connectDB", () => {
  // JSDoc: Prueba: Manejo de errores al conectar a la base de datos
  it("Should handle database connection error", async () => {
    // JSDoc: Espía el método 'authenticate' de la base de datos y fuerza un error simulado
    jest
      .spyOn(db, "authenticate")
      //forza => negamos esa promesa
      .mockRejectedValueOnce(
        new Error("hubo un error al conectar  a la BD ------------------------")
      );
    // JSDoc: Espía el método 'console.log' para verificar si se llama con el mensaje esperado
    const consoleSpy = jest.spyOn(console, "log");

    // JSDoc: Ejecuta la función que conecta a la base de datos
    await connectDB();

    // JSDoc: Verifica que 'console.log' fue llamado con el mensaje esperado
    expect(consoleSpy).toHaveBeenCalledWith(
      //espera que el espia tenga ese contexto
      expect.stringContaining(
        "hubo un error al conectar  a la BD ------------------------"
      )
    );
  });
});
