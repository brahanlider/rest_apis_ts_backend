import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateAvailability,
  updateProduct,
} from "./handlers/product";
import { body, param } from "express-validator";
import { handleInputErrors } from "./middleware";

const router = Router();

// * @swagger: Components
/**
 * @swagger
 * components:
 *    schemas:
 *        Product:
 *           type: object
 *           properties:
 *               id:
 *                   type: integer
 *                   description: The Product ID
 *                   example: 1
 *               name:
 *                   type: string
 *                   description: The Product name
 *                   example: Monitor Curvo de 49 pulgadas
 *               price:
 *                   type: number
 *                   description: The Product price
 *                   example: 300
 *               availability:
 *                   type: boolean
 *                   description: The Product availability
 *                   example: true
 */

// * @swagger: GET => TODOS
/**
 * @swagger
 * /api/products:
 *    get:
 *      summary: Get a list of products
 *      tags:
 *        - Products
 *      description: Return a list of products
 *      responses:
 *        200:
 *          description: Successful response
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Product'
 */
//Routing  => req = enviar | res = obtienes
router.get("/", getProducts);

// * @swagger: GET => ID
/**
 * @swagger
 * /api/products/{id}:
 *    get:
 *       summary: Get a product by ID
 *       tags:
 *          - Products
 *       description: Return a product based on its unique ID
 *       parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to retrieve
 *            required: true
 *            schema:
 *                type: integer
 *       responses:
 *            200:
 *                description: Successful Response
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: '#/components/schemas/Product'
 *
 *            404:
 *                description: Not fund
 *            400:
 *                description: Bad request - Invalid ID
 */
router.get(
  "/:id",
  param("id").isInt().withMessage("ID no válido"),
  handleInputErrors,
  getProductById
);

// * @swagger: POST => crear
/**
 * @swagger
 * /api/products:
 *    post:
 *        summary: Creates a new product
 *        tags:
 *            - Products
 *        description: Returns a new record in the database
 *        requestBody:
 *            required: true
 *            content:
 *                application/json:
 *                    schema:
 *                        type: object
 *                        properties:
 *                            name:
 *                                type: string
 *                                example: "Monitor Curvo 49 Pulgadas"
 *                            price:
 *                                type: number
 *                                example: 399
 *        responses:
 *            201:
 *                description: Successful Response
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: '#/components/schemas/Product'
 *            400:
 *                description: Bad Request - Invalid input data
 */
router.post(
  "/",
  //Validacion
  body("name")
    .notEmpty()
    .withMessage("El nombre del producto no puede ir vacio"),

  body("price")
    .isNumeric()
    .withMessage("Valor no válido")
    .notEmpty()
    .withMessage("El precio del producto no puede ir vacio")
    .custom((value) => value > 0)
    .withMessage("Precio no valido"),
  handleInputErrors,
  createProduct
);

// * @swagger: PUT => EDITAR - ACTUALIZAR TODO
/**
 * @swagger
 * /api/products/{id}:
 *    put:
 *        summary: Updates a product with user input
 *        tags:
 *            - Products
 *        description: Returns the updated product
 *        parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to retrieve
 *            required: true
 *            schema:
 *                type: integer
 *        requestBody:
 *            required: true
 *            content:
 *                application/json:
 *                    schema:
 *                        type: object
 *                        properties:
 *                            name:
 *                                type: string
 *                                example: "Monitor Curvo 49 Pulgadas"
 *                            price:
 *                                type: number
 *                                example: 399
 *                            availability:
 *                                type: boolean
 *                                example: true
 *        responses:
 *            200:
 *                description: Successful Response
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: '#/components/schemas/Product'
 *            400:
 *                description: Bad Request - Invalid Id or Invalid input data
 *            404:
 *                description: Product Not Found
 */
router.put(
  "/:id",
  //Validacion
  param("id").isInt().withMessage("ID no válido"),
  body("name")
    .notEmpty()
    .withMessage("El nombre del producto no puede ir vacio"),

  body("price")
    .isNumeric()
    .withMessage("Valor no válido")
    .notEmpty()
    .withMessage("El precio del producto no puede ir vacio")
    .custom((value) => value > 0)
    .withMessage("Precio no valido"),
  body("availability")
    .isBoolean()
    .withMessage("Valor para disponibilidad no es válido"),
  handleInputErrors,
  updateProduct
);

//* PATCH => EDITAR - MODIFICAR PARTES
/**
 * @swagger
 * /api/products/{id}:
 *    patch:
 *        summary: Updates product availability
 *        tags:
 *            - Products
 *        description: Returns the updated availability
 *        parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to retrieve
 *            required: true
 *            schema:
 *                type: integer
 *        responses:
 *            200:
 *                description: Successful Response
 *                content:
 *                    application/json:
 *                        schema:
 *                            $ref: '#/components/schemas/Product'
 *            400:
 *                description: Bad Request - Invalid Id
 *            404:
 *                description: Product Not Found
 */
router.patch(
  "/:id",
  //Validation
  param("id").isInt().withMessage("ID no válido"),
  handleInputErrors,
  updateAvailability
);

//* DELETE => ELIMINAR
/**
 * @swagger
 * /api/products/{id}:
 *    delete:
 *        summary: Deletes a product by a given ID
 *        tags:
 *            - Products
 *        description: Returns a confirmation message
 *        parameters:
 *          - in: path
 *            name: id
 *            description: The ID of the product to delete
 *            required: true
 *            schema:
 *                type: integer
 *        responses:
 *            200:
 *                description: Successful Response
 *                content:
 *                    application/json:
 *                        schema:
 *                            type: string
 *                            value: "Productos Eliminado"
 *            400:
 *                description: Bad Request - Invalid Id
 *            404:
 *                description: Product Not Found
 */
router.delete(
  "/:id", //Validation
  param("id").isInt().withMessage("ID no válido"),
  handleInputErrors,
  deleteProduct
);

export default router;