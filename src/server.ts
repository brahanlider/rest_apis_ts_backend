import express from "express";
import colors from "colors";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerSpec, { swaggerUiOptions } from "./config/swagger";
import router from "./router";
import db from "./config/db";

//  JSDoc: Función que conecta a la base de datos
export async function connectDB() {
  try {
    // JSDoc: Intenta autenticar la conexión a la base de datos
    await db.authenticate();
    // JSDoc: Sincroniza la base de datos
    db.sync();
    // console.log( colors.magenta.bold("Conexión exitosa a a la bd ------------------------"));
  } catch (error) {
    // console.log(error);
    console.log(
      colors.bgRed.white(
        "hubo un error al conectar  a la BD ------------------------"
      )
    );
  }
}
//  JSDoc: Ejecuta la función al cargar el archivo
connectDB();

// JSDoc:  Instancia de express
const server = express();
// *-----------------CORS--------------------------
const allowedOrigins = [
  process.env.FRONTEND_URL, // Dominio principal de tu frontend
  "https://vercel.app", // Dominio genérico de Vercel
];

//Permitir conexiones
const corsOptions: CorsOptions = {
  //localhoost QUIEN ENVIA PETICION =origin | callback=> PERMITIR O DENEGAR CONEXION
  origin: function (origin, callback) {
    // console.log(origin); //==>conecta con base de datos
    // if (origin === process.env.FRONTEND_URL) {
    if (allowedOrigins.includes(origin) || !origin) {
      // console.log("Permitir.....");
      callback(null, true);
    } else {
      // console.log("denegar");
      callback(new Error("Error de CORS"));
    }
  },
};
server.use(cors(corsOptions));

// Leer datos de formularios (middleware)
server.use(express.json());

server.use(morgan("dev"));

server.use("/api/products", router); //use=todos req  (middleware)

// ?__API:_TESTING
// // server.get("/api", (req, res) => {
// //   res.json({ msg: "Desde API" });
// // });

// Docs
server.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);
export default server;
